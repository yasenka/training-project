"use strict";

const MEASURE = 50;
const ISHEALTHY = "Patient is healthy!";
const ISILL = "Patient in need of treatment.";

var Oculist = {
    jobName: "Oculist",
    toDiagnose: getDiagnosis
};
var Surgeon = {
    jobName: "Surgeon",
    toDiagnose: getDiagnosis
};
var Dentist = {
    jobName: "Dentist",
    toDiagnose: getDiagnosis
};
var Cardiologist = {
    jobName: "Cardiologist",
    toDiagnose: getDiagnosis
};
var Peditrician = {
    jobName: "Peditrician",
    toDiagnose: getFinalDiagnosis
};
var Ivanov = {
    name: "Ivanov",
    healthy: {
        Oculist: 100,
        Surgeon: 100,
        Dentist: 50,
        Cardiologist: 70
    },
    diagnosis: {
        Oculist: null,
        Surgeon: null,
        Dentist: null,
        Cardiologist: null,
        Peditrician: null
    }
};
var Petrov = {
    name: "Petrov",
    healthy: {
        Oculist: 40,
        Surgeon: 90,
        Dentist: 16,
        Cardiologist: 50
    },
    diagnosis: {
        Oculist: null,
        Surgeon: null,
        Dentist: null,
        Cardiologist: null,
        Peditrician: null
    }
};
var Sidorov = {
    name: "Sidorov",
    healthy: {
        Oculist: 60,
        Surgeon: 50,
        Dentist: 20,
        Cardiologist: 46
    },
    diagnosis: {
        Oculist: null,
        Surgeon: null,
        Dentist: null,
        Cardiologist: null,
        Peditrician: null
    }
};
var Novikov = {
    name: "Novikov",
    healthy: {
        Oculist: 50,
        Surgeon: 45,
        Dentist: 65,
        Cardiologist: 100
    },
    diagnosis: {
        Oculist: null,
        Surgeon: null,
        Dentist: null,
        Cardiologist: null,
        Peditrician: null
    }
};
var doctorsList = {
    Oculist: Oculist,
    Surgeon: Surgeon,
    Dentist: Dentist,
    Cardiologist: Cardiologist,
    Peditrician: Peditrician
};
var patientsList = [Ivanov, Petrov, Sidorov, Novikov];

function getFinalDiagnosis(patient) {
    var finalDiagnosis = 0;
    var i = 0;

    for(var doctorSpecialty in patient.diagnosis) {
        if(patient.diagnosis[doctorSpecialty] === ISHEALTHY && patient.diagnosis[doctorSpecialty] != doctorSpecialty) {
            finalDiagnosis += patient.healthy[doctorSpecialty];
        }

        if(patient.diagnosis[doctorSpecialty] === ISILL && patient.diagnosis[doctorSpecialty] != doctorSpecialty) {
            finalDiagnosis += patient.healthy[doctorSpecialty];
        }
        i++
    }

    if(finalDiagnosis / (i - 1) >= MEASURE) {
        finalDiagnosis = ISHEALTHY;
    } else {
        finalDiagnosis = ISILL;
    }

    return finalDiagnosis;
}

function getDiagnosis(patient, doctorSpecialty) {
    var diagnosis;

    if(patient.healthy[doctorSpecialty] >= 50) {
        diagnosis = ISHEALTHY;
    } else {
        diagnosis = ISILL;
    }

    return diagnosis;
}

function getPatientHealthy (patient){
    for(var doctorSpecialty in doctorsList) {
        patient.diagnosis[doctorSpecialty] = doctorsList[doctorSpecialty].toDiagnose(patient, doctorSpecialty);
    }
}

function runMedicalboard() {
    patientsList.forEach(function(patient) {
        getPatientHealthy(patient);
    });
}

function mergePatientDiagnosis(patient) {
    var patientDiagnosis = '';

    for(var diagnosis in patient.diagnosis) {
        var fontColor ='black';
        if(patient.diagnosis[diagnosis] === ISILL) {
            fontColor = 'red';
        }
        patientDiagnosis += '<td style="color:' + fontColor + '">' + patient.diagnosis[diagnosis] + '</td>';
    }

    return patientDiagnosis;
}

function getDoctorStatistic(doctorSpecialty) {
    var doctorStatistic = {
        healthyPatientCount: null,
        isillPatientCount: null
    };
    var patientHealthy = 0;
    var patientIsIll = 0;

    patientsList.forEach(function(patient) {
            if(patient.diagnosis[doctorSpecialty] === ISILL) {
                patientIsIll++;
            } else {
                patientHealthy++;
            }
    });

    doctorStatistic.healthyPatientCount = patientHealthy;
    doctorStatistic.isillPatientCount = patientIsIll;

    return doctorStatistic;
}

function buildReport() {
    var medicalboardDate = new Date();
    var reportDate = document.getElementById("reportDate");
    reportDate.innerHTML = medicalboardDate.getDate() + "/" + (medicalboardDate.getMonth() + 1) + "/" + medicalboardDate.getFullYear();
    var reportTable = document.getElementById("reportTable");
    var table = '';
    var thead = '<tr style="font-weight: bold"><td>№ п/п</td><td>ФИО</td>';
    var tbody = '';
    var tbottomHealthy = '';
    var tbottomIsIll = '';
    var tbottom = '';
    var patientDiagnosis;


    for(var doctorSpecialty in doctorsList) {
        thead += '<td>' + doctorSpecialty + '</td>';
    }
    thead += '</tr>';

    patientsList.forEach(function(patient, i) {
        patientDiagnosis = mergePatientDiagnosis(patient);
        tbody += '<tr><td>' + (i + 1) + '</td><td>' +  patient.name + '</td>' + patientDiagnosis + '</tr>'
    });

    for(var doctorSpecialty in doctorsList) {
        var doctorStatistic = getDoctorStatistic(doctorSpecialty);
        tbottomHealthy += '<td>' + doctorStatistic.healthyPatientCount + '</td>';
        tbottomIsIll += '<td style="color:red">' + doctorStatistic.isillPatientCount + '</td>';
    }
    tbottom += '<tr><td>Итого:</td><td>Здоров (>=' + MEASURE + ')</td>' + tbottomHealthy + '</tr>';
    tbottom += '<tr><td></td><td style="color:red">Болен (<' + MEASURE + ')</td>' + tbottomIsIll + '</tr>';

    table += thead + tbody + tbottom;

    reportTable.innerHTML=table;
}

function runApp() {
    runMedicalboard();
    buildReport();
}
runApp();