# AWS Developer: Getting Started with DynamoDB

##Index

* problemQuery.js: The problem query which is consuming a lot of RCUs.
* index.ttl.js: Script to modify table to add a TTL attribute to the Job table.
* closedJobs.js: Lambda Function to move jobs to ClosedJobs table
* ClosedJob.json: CloudFormation template for the Closed Job table.
* ClosedJobTrigger.json: IAM Policy for the Closed Jobs Trigger