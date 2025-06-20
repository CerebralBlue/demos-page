-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_name" TEXT NOT NULL,
    "duns" TEXT NOT NULL,
    "Industry_Description" TEXT NOT NULL,
    "Adverse_Media_Flag" TEXT NOT NULL,
    "Sanctions_Flag" TEXT NOT NULL,
    "Business_Status" TEXT NOT NULL
);
