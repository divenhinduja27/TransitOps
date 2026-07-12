package com.yadg.TransitOp.controller;

import com.lowagie.text.DocumentException;
import com.yadg.TransitOp.dto.AnalyticsSummaryResponse;
import com.yadg.TransitOp.service.AnalyticsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getAnalyticsSummary(
            @RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String tripStatus) {

        AnalyticsSummaryResponse summary = analyticsService.getAnalyticsSummary(vehicleId, type, region, startDate, endDate, tripStatus);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf(
            @RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String tripStatus) {

        byte[] pdfBytes = analyticsService.exportPdf(vehicleId, type, region, startDate, endDate, tripStatus);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "TransitOps_Analytics_Report.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String tripStatus) {

        byte[] csvBytes = analyticsService.exportCsv(vehicleId, type, region, startDate, endDate, tripStatus);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "TransitOps_Analytics_Report.csv");

        return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
    }
}
