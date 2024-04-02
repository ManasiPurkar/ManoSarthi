package com.team9.manosarthi_backend.Services;



import java.util.List;
import com.team9.manosarthi_backend.Entities.Doctor;
import com.team9.manosarthi_backend.Entities.MedicalQue;
import com.team9.manosarthi_backend.Entities.Questionarrie;
import com.team9.manosarthi_backend.Entities.Supervisor;
import org.springframework.http.ResponseEntity;

public interface AdminService  {

    Doctor adddoctor(Doctor doctor);

    Supervisor addSupervisor(Supervisor supervisor);

    List<Doctor> viewAllDoctor(int pagenumber,int pagesize);
    List<Doctor> viewDoctorByDistrict(int districtcode, int pagenumber, int pagesize);

    List<Doctor> viewDoctorBySubDistrict(int subdistrictcode);

    Supervisor ReassignSupervisor(Supervisor updatedSupervisor);
    Questionarrie addQuestionarrie(Questionarrie questionarrie);

    MedicalQue addMedicalQuestionarrie(MedicalQue medicalques);



}
