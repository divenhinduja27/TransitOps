package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.CompleteTripRequest;
import com.yadg.TransitOp.dto.TripRequest;
import com.yadg.TransitOp.dto.TripResponse;

import java.util.List;

public interface TripService {
    TripResponse createTrip(TripRequest request);
    TripResponse dispatchTrip(Long id);
    TripResponse completeTrip(Long id, CompleteTripRequest request);
    TripResponse cancelTrip(Long id);
    List<TripResponse> getAllTrips();
    TripResponse getTripById(Long id);
}
