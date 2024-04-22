package com.team9.manosarthi_backend.Services;

import com.team9.manosarthi_backend.DTO.PrescriptionDTO;
import com.team9.manosarthi_backend.DTO.RegisterFollowUpDetailsDTO;
import com.team9.manosarthi_backend.Entities.*;
import com.team9.manosarthi_backend.DTO.RegisterPatientDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface WorkerService {

    Worker viewProfile(int id);
    Worker UpdateWorkerProfile(Worker updatedWorker);

    Patient registerPatient(RegisterPatientDTO registerPatientDTO,int workerId);
//    Patient registerPatient(Patient patient);
    List<String> getAabhaid(int villagecode);

    List<FollowUpSchedule> get_followup_schedule(int workerid);

    List<Prescription> getprescriptions(int workerid);

    int addFollowUpDetails(RegisterFollowUpDetailsDTO registerFollowUpDetailsDTO, int workerid);
}
