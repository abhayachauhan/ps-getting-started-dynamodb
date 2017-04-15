var faker = require('faker');

var currentEpochTime = Math.floor(new Date() / 1000);
var secondsInADay = 86400;

var applicants = {};
var jobs = {};
var jobApplications = {};

function generateUniqueJob() {
  var newJob = {
    "JobId": {
      S: faker.random.uuid()
    },
    "CountryId": {
      S: faker.random.number({
        'min': 1,
        'max': 50
      }).toString()
    },
    "JobTitle": {
      S: faker.name.jobTitle()
    },
    "JobType": {
      S: faker.name.jobType()
    },
    "JobDescription": {
      S: faker.name.jobDescriptor()
    },
    "ClosingTime": {  
      N: faker.random.number({
        'min': currentEpochTime + secondsInADay,
        'max': currentEpochTime + (secondsInADay * 10)
      }).toString()
    }
  };

  jobs[newJob.JobId.S] = newJob;
  return newJob;
}

function generateUniqueApplicant() {
  var newApplicant = {
    "ApplicantId": {
      S: faker.random.uuid()
    },
    "FirstName": {
      S: faker.name.firstName()
    },
    "LastName": {
      S: faker.name.lastName()
    }
  };

  applicants[newApplicant.ApplicantId.S] = newApplicant;
  return newApplicant;
}

function generateJobApplication(job, applicant) {
  var newJobApplication = {
    "JobId" : {
      "S": job.JobId.S
    },
    "ApplicantId": {
      "S": applicant.ApplicantId.S
    },
    "TimeApplied": {
      "N": faker.random.number({
        'min': currentEpochTime + secondsInADay,
        'max': job.ClosingTime.N
      }).toString()
    },
    "ApplicationForm": {
      "S": JSON.stringify(faker.helpers.userCard())
    }
  };

  var key = generateJobApplicationKey(job, applicant);
  jobApplications[key] = newJobApplication;

  return newJobApplication;
}

function generateJobApplicationKey(job, applicant) {
  return job.JobId.S + '_' + applicant.ApplicantId.S;
}

function generateAllData(numberOfJobs, numberOfApplicants) {
  for (var i=0; i<numberOfApplicants; i++) {
    generateUniqueApplicant();
  }

  for (var i=0; i<numberOfJobs; i++) {
    var job = generateUniqueJob();

    var numberOfJobApplications = faker.random.number({
                                    'min': 0,
                                    'max': numberOfApplicants/10
                                  });

    for(var applications=0; applications<numberOfJobApplications; applications++) {
      // Ensure applicant has not applied to this job
      var applicant;    
      do {
        applicant = faker.random.objectElement(applicants);
      } while (generateJobApplicationKey(job, applicant) in jobApplications);

      generateJobApplication(job, applicant);
    }
  }

  return {
    Applicant: applicants,
    Job: jobs,
    JobApplication: jobApplications
  };

}

module.exports.generateUniqueJob = generateUniqueJob;
module.exports.generateUniqueApplicant = generateUniqueApplicant;
module.exports.generateJobApplication = generateJobApplication;
module.exports.generateAllData = generateAllData;
