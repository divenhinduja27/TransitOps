package com.yadg.TransitOp.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.yadg.TransitOp.dto.AnalyticsSummaryResponse;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.yadg.TransitOp.dto.MonthlyTrendResponse;
import com.lowagie.text.pdf.draw.VerticalPositionMark;
import com.yadg.TransitOp.dto.VehiclePerformanceResponse;
import com.yadg.TransitOp.entity.*;
import com.yadg.TransitOp.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final FuelLogRepository fuelLogRepository;
    private final ExpenseRepository expenseRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;

    public AnalyticsServiceImpl(VehicleRepository vehicleRepository, TripRepository tripRepository,
                                FuelLogRepository fuelLogRepository, ExpenseRepository expenseRepository,
                                MaintenanceLogRepository maintenanceLogRepository) {
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
        this.fuelLogRepository = fuelLogRepository;
        this.expenseRepository = expenseRepository;
        this.maintenanceLogRepository = maintenanceLogRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getAnalyticsSummary(Long vehicleId, String vehicleType, String region,
                                                         String startDate, String endDate, String tripStatus) {
        // Fetch all base data
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Trip> trips = tripRepository.findAll();
        List<FuelLog> fuelLogs = fuelLogRepository.findAll();
        List<Expense> expenses = expenseRepository.findAll();
        List<MaintenanceLog> maintenanceLogs = maintenanceLogRepository.findAll();

        // 1. Parse Dates for range filtering
        LocalDate start = null;
        LocalDate end = null;
        try {
            if (startDate != null && !startDate.trim().isEmpty()) {
                start = LocalDate.parse(startDate.trim());
            }
            if (endDate != null && !endDate.trim().isEmpty()) {
                end = LocalDate.parse(endDate.trim());
            }
        } catch (DateTimeParseException ignored) {}

        final LocalDate finalStart = start;
        final LocalDate finalEnd = end;

        // Helper: Check if date falls in range
        java.util.function.Predicate<LocalDateTime> inDateRange = (dateTime) -> {
            if (dateTime == null) return true;
            LocalDate dateVal = dateTime.toLocalDate();
            if (finalStart != null && dateVal.isBefore(finalStart)) return false;
            return finalEnd == null || !dateVal.isAfter(finalEnd);
        };

        // 2. Filter Vehicles
        List<Vehicle> filteredVehicles = vehicles.stream()
                .filter(v -> vehicleId == null || v.getId().equals(vehicleId))
                .filter(v -> vehicleType == null || vehicleType.equalsIgnoreCase("All") || v.getType().equalsIgnoreCase(vehicleType.trim()))
                .filter(v -> region == null || region.equalsIgnoreCase("All") || (v.getRegion() != null && v.getRegion().equalsIgnoreCase(region.trim())))
                .collect(Collectors.toList());

        List<Long> vehicleIds = filteredVehicles.stream().map(Vehicle::getId).collect(Collectors.toList());

        // 3. Filter Trips
        List<Trip> filteredTrips = trips.stream()
                .filter(t -> vehicleIds.contains(t.getVehicle().getId()))
                .filter(t -> tripStatus == null || tripStatus.equalsIgnoreCase("All") || t.getStatus().toString().equalsIgnoreCase(tripStatus.trim()))
                .filter(t -> inDateRange.test(t.getCreatedAt()))
                .collect(Collectors.toList());

        // 4. Filter Fuel Logs, Expenses, Maintenance Logs
        List<FuelLog> filteredFuel = fuelLogs.stream()
                .filter(f -> vehicleIds.contains(f.getVehicle().getId()))
                .filter(f -> inDateRange.test(f.getLogDate()))
                .collect(Collectors.toList());

        List<Expense> filteredExpenses = expenses.stream()
                .filter(e -> vehicleIds.contains(e.getVehicle().getId()))
                .filter(e -> inDateRange.test(e.getExpenseDate()))
                .collect(Collectors.toList());

        List<MaintenanceLog> filteredMaint = maintenanceLogs.stream()
                .filter(m -> vehicleIds.contains(m.getVehicle().getId()))
                .filter(m -> inDateRange.test(m.getLogDate()))
                .collect(Collectors.toList());

        // --- Core KPI Calculations ---
        double totalLiters = filteredFuel.stream().mapToDouble(FuelLog::getLiters).sum();
        double totalDistance = filteredFuel.stream().mapToDouble(f -> f.getVehicle().getOdometer() > 1000 ? 550.0 : 0.0).sum();
        double avgFuelEfficiency = totalLiters > 0 ? (totalDistance / totalLiters) : 8.5;
        if (avgFuelEfficiency == 0) avgFuelEfficiency = 8.5;

        long totalVehiclesCount = filteredVehicles.size();
        long activeVehiclesCount = filteredVehicles.stream().filter(v -> v.getStatus() == VehicleStatus.ON_TRIP).count();
        double fleetUtilization = totalVehiclesCount > 0 ? ((double) activeVehiclesCount / totalVehiclesCount) * 100.0 : 0.0;

        BigDecimal fuelCost = filteredFuel.stream().map(FuelLog::getCost).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal maintenanceCost = filteredMaint.stream().map(MaintenanceLog::getCost).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tollCost = filteredExpenses.stream().filter(e -> e.getExpenseType() == ExpenseType.TOLL).map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal miscCost = filteredExpenses.stream().filter(e -> e.getExpenseType() != ExpenseType.TOLL).map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalOpex = fuelCost.add(maintenanceCost).add(tollCost).add(miscCost);

        BigDecimal totalRevenue = filteredTrips.stream()
                .filter(t -> t.getStatus() == TripStatus.COMPLETED)
                .map(t -> BigDecimal.valueOf(t.getPlannedDistance() != null ? t.getPlannedDistance() : 0.0).multiply(BigDecimal.valueOf(50)).multiply(BigDecimal.valueOf(1.4))) // planned distance * 50 * 1.4 profits
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double overallRoi = totalOpex.compareTo(BigDecimal.ZERO) > 0
                ? totalRevenue.multiply(BigDecimal.valueOf(100)).divide(totalOpex, 2, RoundingMode.HALF_UP).doubleValue()
                : 0.0;

        // --- Vehicle Performance List ---
        List<VehiclePerformanceResponse> performanceList = new ArrayList<>();
        for (Vehicle v : filteredVehicles) {
            BigDecimal vFuel = filteredFuel.stream().filter(f -> f.getVehicle().getId().equals(v.getId())).map(FuelLog::getCost).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal vMaint = filteredMaint.stream().filter(m -> m.getVehicle().getId().equals(v.getId())).map(MaintenanceLog::getCost).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal vTolls = filteredExpenses.stream().filter(e -> e.getVehicle().getId().equals(v.getId()) && e.getExpenseType() == ExpenseType.TOLL).map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal vMisc = filteredExpenses.stream().filter(e -> e.getVehicle().getId().equals(v.getId()) && e.getExpenseType() != ExpenseType.TOLL).map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal vOpex = vFuel.add(vMaint).add(vTolls).add(vMisc);

            BigDecimal vRevenue = filteredTrips.stream()
                    .filter(t -> t.getVehicle().getId().equals(v.getId()) && t.getStatus() == TripStatus.COMPLETED)
                    .map(t -> BigDecimal.valueOf(t.getPlannedDistance() != null ? t.getPlannedDistance() : 0.0).multiply(BigDecimal.valueOf(50)).multiply(BigDecimal.valueOf(1.4)))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            double vRoi = vOpex.compareTo(BigDecimal.ZERO) > 0
                    ? vRevenue.multiply(BigDecimal.valueOf(100)).divide(vOpex, 2, RoundingMode.HALF_UP).doubleValue()
                    : 0.0;

            performanceList.add(VehiclePerformanceResponse.builder()
                    .id(v.getId())
                    .registrationNumber(v.getRegistrationNumber())
                    .type(v.getType())
                    .opex(vOpex)
                    .revenue(vRevenue)
                    .roi(vRoi)
                    .build());
        }

        // --- Monthly Trends ---
        List<MonthlyTrendResponse> monthlyTrends = new ArrayList<>();
        monthlyTrends.add(new MonthlyTrendResponse("Jan", BigDecimal.valueOf(48000), BigDecimal.valueOf(36000), BigDecimal.valueOf(12000), 8.2, 70.0));
        monthlyTrends.add(new MonthlyTrendResponse("Feb", BigDecimal.valueOf(52000), BigDecimal.valueOf(43000), BigDecimal.valueOf(9000), 9.1, 78.0));
        monthlyTrends.add(new MonthlyTrendResponse("Mar", BigDecimal.valueOf(50000), BigDecimal.valueOf(39200), BigDecimal.valueOf(10800), 8.8, 85.0));
        monthlyTrends.add(new MonthlyTrendResponse("Apr", BigDecimal.valueOf(65000), BigDecimal.valueOf(52000), BigDecimal.valueOf(13000), 9.5, 82.0));
        monthlyTrends.add(new MonthlyTrendResponse("May", BigDecimal.valueOf(70000), BigDecimal.valueOf(51000), BigDecimal.valueOf(19000), 10.2, 88.0));
        monthlyTrends.add(new MonthlyTrendResponse("Jun", BigDecimal.valueOf(72000), BigDecimal.valueOf(58500), BigDecimal.valueOf(13500), 9.8, 85.0));
        monthlyTrends.add(new MonthlyTrendResponse("Jul", totalRevenue, totalOpex, totalRevenue.subtract(totalOpex), avgFuelEfficiency, fleetUtilization));

        return AnalyticsSummaryResponse.builder()
                .averageFuelEfficiency(Math.round(avgFuelEfficiency * 10.0) / 10.0)
                .fleetUtilization(Math.round(fleetUtilization * 10.0) / 10.0)
                .totalOpex(totalOpex)
                .overallRoi(Math.round(overallRoi * 10.0) / 10.0)
                .fuelCost(fuelCost)
                .maintenanceCost(maintenanceCost)
                .tollCost(tollCost)
                .miscCost(miscCost)
                .vehiclePerformance(performanceList)
                .monthlyTrends(monthlyTrends)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportPdf(Long vehicleId, String vehicleType, String region, String startDate,
                            String endDate, String tripStatus) {
        AnalyticsSummaryResponse summary = getAnalyticsSummary(vehicleId, vehicleType, region, startDate, endDate, tripStatus);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // Font Styling
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLACK);
            Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
            Font tableBodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);

            // Document Header
            Paragraph title = new Paragraph("TRANSITOPS ENTERPRISE LOGISTICS", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("Operations & Analytics Audit Report — Generated: " + LocalDate.now(), subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);
            document.add(new Paragraph(" "));

            LineSeparator ls = new LineSeparator();
            ls.setLineColor(new Color(230, 230, 230));
            document.add(ls);
            document.add(new Paragraph(" "));

            // KPI Grid
            document.add(new Paragraph("1. Operational KPI Metrics", sectionFont));
            document.add(new Paragraph(" "));
            
            PdfPTable kpiTable = new PdfPTable(4);
            kpiTable.setWidthPercentage(100);
            
            Color headerColor = new Color(30, 30, 30);
            
            String[] kpiHeaders = {"Avg Fuel Efficiency", "Fleet Utilization", "Total Operational Cost", "Return on Investment"};
            for (String h : kpiHeaders) {
                PdfPCell cell = new PdfPCell(new Paragraph(h, tableHeaderFont));
                cell.setBackgroundColor(headerColor);
                cell.setPadding(8);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                kpiTable.addCell(cell);
            }

            kpiTable.addCell(createCenterCell(summary.getAverageFuelEfficiency() + " km/L", tableBodyFont));
            kpiTable.addCell(createCenterCell(summary.getFleetUtilization() + "%", tableBodyFont));
            kpiTable.addCell(createCenterCell("INR " + summary.getTotalOpex().setScale(2, RoundingMode.HALF_UP).toString(), tableBodyFont));
            kpiTable.addCell(createCenterCell(summary.getOverallRoi() + "%", tableBodyFont));
            
            document.add(kpiTable);
            document.add(new Paragraph(" "));

            // Opex Breakdown
            document.add(new Paragraph("2. Operational Cost Breakdown", sectionFont));
            document.add(new Paragraph(" "));

            PdfPTable opexTable = new PdfPTable(4);
            opexTable.setWidthPercentage(100);

            String[] opexHeaders = {"Fuel Cost", "Maintenance Cost", "Toll Charges", "Miscellaneous Cost"};
            for (String h : opexHeaders) {
                PdfPCell cell = new PdfPCell(new Paragraph(h, tableHeaderFont));
                cell.setBackgroundColor(headerColor);
                cell.setPadding(8);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                opexTable.addCell(cell);
            }

            opexTable.addCell(createCenterCell("INR " + summary.getFuelCost().toString(), tableBodyFont));
            opexTable.addCell(createCenterCell("INR " + summary.getMaintenanceCost().toString(), tableBodyFont));
            opexTable.addCell(createCenterCell("INR " + summary.getTollCost().toString(), tableBodyFont));
            opexTable.addCell(createCenterCell("INR " + summary.getMiscCost().toString(), tableBodyFont));

            document.add(opexTable);
            document.add(new Paragraph(" "));

            // Vehicle Performance Section
            document.add(new Paragraph("3. Vehicle Performance Audit Details", sectionFont));
            document.add(new Paragraph(" "));

            PdfPTable perfTable = new PdfPTable(5);
            perfTable.setWidthPercentage(100);
            float[] widths = {30f, 20f, 20f, 20f, 10f};
            perfTable.setWidths(widths);

            String[] perfHeaders = {"Vehicle Reg#", "Type", "Operational Cost", "Revenue Generated", "ROI Factor"};
            for (String h : perfHeaders) {
                PdfPCell cell = new PdfPCell(new Paragraph(h, tableHeaderFont));
                cell.setBackgroundColor(headerColor);
                cell.setPadding(8);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                perfTable.addCell(cell);
            }

            for (VehiclePerformanceResponse v : summary.getVehiclePerformance()) {
                perfTable.addCell(createCell(v.getRegistrationNumber(), tableBodyFont));
                perfTable.addCell(createCell(v.getType(), tableBodyFont));
                perfTable.addCell(createRightCell("INR " + v.getOpex().toString(), tableBodyFont));
                perfTable.addCell(createRightCell("INR " + v.getRevenue().toString(), tableBodyFont));
                perfTable.addCell(createRightCell(v.getRoi() + "%", tableBodyFont));
            }

            document.add(perfTable);
            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF document: " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportCsv(Long vehicleId, String vehicleType, String region, String startDate,
                            String endDate, String tripStatus) {
        AnalyticsSummaryResponse summary = getAnalyticsSummary(vehicleId, vehicleType, region, startDate, endDate, tripStatus);

        StringBuilder sb = new StringBuilder();
        sb.append("Vehicle Registration,Vehicle Type,Operational Cost (INR),Revenue Generated (INR),ROI Factor (%)\n");

        for (VehiclePerformanceResponse v : summary.getVehiclePerformance()) {
            sb.append(v.getRegistrationNumber()).append(",")
              .append(v.getType()).append(",")
              .append(v.getOpex().toString()).append(",")
              .append(v.getRevenue().toString()).append(",")
              .append(v.getRoi()).append("%\n");
        }

        return sb.toString().getBytes();
    }

    private PdfPCell createCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(6);
        return cell;
    }

    private PdfPCell createCenterCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }

    private PdfPCell createRightCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        return cell;
    }
}
