package com.medicationtracker.config;

import com.medicationtracker.model.Drug;
import com.medicationtracker.repository.DrugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    DrugRepository drugRepository;

    @Override
    public void run(String... args) throws Exception {
        if (drugRepository.count() == 0) {
            // Seed sample drugs
            drugRepository.save(new Drug(null, "Amoxicillin 500mg", "AMX-2024-001", LocalDate.of(2025, 12, 31), 150,
                    12.50, "PharmaCorp", 20, "Antibiotic", null, null));
            drugRepository.save(new Drug(null, "Atorvastatin 20mg", "ATV-2024-055", LocalDate.of(2026, 6, 15), 500,
                    45.00, "HealthMed", 30, "Cholesterol", null, null));
            drugRepository.save(new Drug(null, "Metformin 850mg", "MET-2023-889", LocalDate.of(2025, 3, 20), 45, 8.40,
                    "GlucoCare", 50, "Diabetes", null, null)); // Close to low
            drugRepository.save(new Drug(null, "Ibuprofen 400mg", "IBU-2024-112", LocalDate.of(2027, 1, 1), 8, 5.99,
                    "PainFree Ltd", 10, "Pain Relief", null, null)); // Low stock
            drugRepository.save(new Drug(null, "Lisinopril 10mg", "LIS-2024-334", LocalDate.of(2025, 9, 10), 200, 15.20,
                    "HeartSafe", 25, "Blood Pressure", null, null));
            drugRepository.save(new Drug(null, "Omeprazole 20mg", "OME-2024-998", LocalDate.of(2024, 11, 30), 5, 22.10,
                    "GastroMed", 15, "Acid Reflux", null, null)); // Expiring soon & Low stock

            System.out.println("Data Loaded: Sample drugs added to inventory.");
        }
    }
}
