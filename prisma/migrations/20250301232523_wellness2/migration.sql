-- CreateTable
CREATE TABLE "ParticipantData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" TEXT NOT NULL,
    "round_of_phone_calls" INTEGER NOT NULL,
    "days_in_treatment" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "have_you_been_abstinent_the_past_28_days" TEXT NOT NULL,
    "if_yes_how_long_have_you_been_abstinent" TEXT NOT NULL,
    "phoneTime" INTEGER NOT NULL,
    "depression" INTEGER NOT NULL,
    "anxiety" INTEGER NOT NULL,
    "sleep" INTEGER NOT NULL,
    "recovery" INTEGER NOT NULL,
    "Mobile_Phone_Problematic_Use_Score" INTEGER NOT NULL,
    "Advanced_Warning_of_Relapse_Score" INTEGER NOT NULL
);
