package com.pds.clinicservice.service;

import com.pds.clinicservice.entity.Patient;
import com.pds.clinicservice.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Patient Service Unit Tests")
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    private Patient testPatient;

    @BeforeEach
    void setUp() {
        testPatient = new Patient();
        testPatient.setId(1L);
        testPatient.setFirstName("John");
        testPatient.setLastName("Doe");
        testPatient.setEmail("john.doe@example.com");
        testPatient.setPhone("+33612345678");
        testPatient.setDateOfBirth(LocalDate.of(1990, 5, 15));
        testPatient.setGender("Male");
        testPatient.setAddress("123 Main Street, Paris");
        testPatient.setBloodType("A+");
        testPatient.setEmergencyContact("Jane Doe");
        testPatient.setEmergencyPhone("+33698765432");
    }

    @Test
    @DisplayName("Should return all patients")
    void getAllPatients_ShouldReturnAllPatients() {
        Patient patient2 = new Patient();
        patient2.setId(2L);
        patient2.setFirstName("Jane");
        patient2.setLastName("Smith");

        when(patientRepository.findAll()).thenReturn(Arrays.asList(testPatient, patient2));

        List<Patient> result = patientService.getAllPatients();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getFirstName()).isEqualTo("John");
        assertThat(result.get(1).getFirstName()).isEqualTo("Jane");
        verify(patientRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no patients exist")
    void getAllPatients_ShouldReturnEmptyList_WhenNoPatients() {
        when(patientRepository.findAll()).thenReturn(List.of());

        List<Patient> result = patientService.getAllPatients();

        assertThat(result).isEmpty();
        verify(patientRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return patient by ID")
    void getPatientById_ShouldReturnPatient_WhenExists() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));

        Patient result = patientService.getPatientById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("John");
        assertThat(result.getEmail()).isEqualTo("john.doe@example.com");
        verify(patientRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when patient not found")
    void getPatientById_ShouldThrowException_WhenNotFound() {
        when(patientRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> patientService.getPatientById(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Patient not found");
        verify(patientRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should create a new patient")
    void createPatient_ShouldSaveAndReturnPatient() {
        when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);

        Patient newPatient = new Patient();
        newPatient.setFirstName("John");
        newPatient.setLastName("Doe");
        newPatient.setEmail("john.doe@example.com");

        Patient result = patientService.createPatient(newPatient);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("John");
        verify(patientRepository, times(1)).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should update an existing patient")
    void updatePatient_ShouldUpdateAndReturnPatient() {
        Patient updatedInfo = new Patient();
        updatedInfo.setFirstName("Johnny");
        updatedInfo.setLastName("Doe Updated");
        updatedInfo.setEmail("johnny.doe@example.com");
        updatedInfo.setPhone("+33611111111");
        updatedInfo.setDateOfBirth(LocalDate.of(1990, 5, 15));
        updatedInfo.setGender("Male");
        updatedInfo.setAddress("456 New Street, Lyon");
        updatedInfo.setBloodType("B+");
        updatedInfo.setEmergencyContact("Jim Doe");
        updatedInfo.setEmergencyPhone("+33622222222");

        when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));
        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Patient result = patientService.updatePatient(1L, updatedInfo);

        assertThat(result.getFirstName()).isEqualTo("Johnny");
        assertThat(result.getLastName()).isEqualTo("Doe Updated");
        assertThat(result.getEmail()).isEqualTo("johnny.doe@example.com");
        assertThat(result.getAddress()).isEqualTo("456 New Street, Lyon");
        verify(patientRepository, times(1)).findById(1L);
        verify(patientRepository, times(1)).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent patient")
    void updatePatient_ShouldThrowException_WhenPatientNotFound() {
        Patient updatedInfo = new Patient();
        updatedInfo.setFirstName("Johnny");

        when(patientRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> patientService.updatePatient(999L, updatedInfo))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Patient not found");
        verify(patientRepository, times(1)).findById(999L);
        verify(patientRepository, never()).save(any(Patient.class));
    }

    @Test
    @DisplayName("Should delete a patient")
    void deletePatient_ShouldCallRepositoryDelete() {
        doNothing().when(patientRepository).deleteById(1L);

        patientService.deletePatient(1L);

        verify(patientRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should handle null values in patient creation")
    void createPatient_ShouldHandleNullValues() {
        Patient minimalPatient = new Patient();
        minimalPatient.setFirstName("Minimal");
        minimalPatient.setLastName("Patient");

        when(patientRepository.save(any(Patient.class))).thenReturn(minimalPatient);

        Patient result = patientService.createPatient(minimalPatient);

        assertThat(result).isNotNull();
        assertThat(result.getFirstName()).isEqualTo("Minimal");
        assertThat(result.getEmail()).isNull();
        verify(patientRepository, times(1)).save(any(Patient.class));
    }
}
