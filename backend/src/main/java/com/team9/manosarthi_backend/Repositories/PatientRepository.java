package com.team9.manosarthi_backend.Repositories;

import com.team9.manosarthi_backend.Entities.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientRepository extends JpaRepository<Patient,Integer> {

    @Query("SELECT p from Patient p where p.village.subDistrict.code=:subdistrictcode and p.status='NEW'")
    Page<Patient> getNewPatientBySubdistrict(@Param("subdistrictcode") int subdistrictcode, Pageable pageable);
}