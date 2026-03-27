-- CreateTable
CREATE TABLE "CV" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "rawText" TEXT NOT NULL,
    "feedback" TEXT,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverLetter" (
    "id" TEXT NOT NULL,
    "cvId" TEXT,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "generatedLetter" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QASession" (
    "id" TEXT NOT NULL,
    "cvId" TEXT,
    "question" TEXT NOT NULL,
    "context" TEXT,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QASession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyResearch" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "researchData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobOpportunity" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "title" TEXT,
    "company" TEXT,
    "location" TEXT,
    "salaryRange" TEXT,
    "jobType" TEXT,
    "description" TEXT,
    "requirements" TEXT,
    "applicationUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'saved',
    "notes" TEXT,
    "scrapedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOpportunity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV"("id") ON DELETE SET NULL ON UPDATE CASCADE;
