package com.medicationtracker.controller;

import com.medicationtracker.repository.*;
import com.medicationtracker.auth.UserRepository;
import com.medicationtracker.model.*;
import com.medicationtracker.service.AdherenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    DrugRepository drugRepository;

    @Autowired
    PrescriptionRepository prescriptionRepository;

    @Autowired
    AdherenceService adherenceService;

    @GetMapping("/admin/stats")
    public ResponseEntity<?> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalPrescriptions", prescriptionRepository.count());
        // Simple counts for demo
        stats.put("totalDrugs", drugRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/pharmacist/overview")
    public ResponseEntity<?> getPharmacistOverview() {
        Map<String, Object> stats = new HashMap<>();
        List<Drug> lowStock = drugRepository.findByQuantityLessThanEqual(10);
        stats.put("lowStockCount", lowStock.size());
        stats.put("lowStockItems", lowStock);
        stats.put("totalInventoryValue",
                drugRepository.findAll().stream().mapToDouble(d -> d.getPrice() * d.getQuantity()).sum());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/patient/{id}/history")
    public ResponseEntity<?> getPatientAdherenceHistory(@PathVariable Long id) {
        // Mocking historical trend data for the graph (Real impl would aggregate
        // MedicationLogs by date)
        // Returning a list of { label: 'Week X', value: 85 } objects
        List<Map<String, Object>> mockTrend = List.of(
                Map.of("name", "Week 1", "adherence", 65),
                Map.of("name", "Week 2", "adherence", 75),
                Map.of("name", "Week 3", "adherence", 50),
                Map.of("name", "Week 4", "adherence", 85));

        Map<String, Object> response = new HashMap<>();
        response.put("currentAdherence", adherenceService.calculateAdherence(id));
        response.put("trend", mockTrend);

        return ResponseEntity.ok(response);
    }
}
