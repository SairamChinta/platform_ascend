-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ceed" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,

    CONSTRAINT "Ceed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "ceedId" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "ceedId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableAction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AvailableAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableTrigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AvailableTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CeedRun" (
    "id" TEXT NOT NULL,
    "ceedId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "CeedRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CeedRunOutbox" (
    "id" TEXT NOT NULL,
    "ceedRunId" TEXT NOT NULL,

    CONSTRAINT "CeedRunOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_ceedId_key" ON "Trigger"("ceedId");

-- CreateIndex
CREATE UNIQUE INDEX "CeedRunOutbox_ceedRunId_key" ON "CeedRunOutbox"("ceedRunId");

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AvailableTrigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_ceedId_fkey" FOREIGN KEY ("ceedId") REFERENCES "Ceed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_ceedId_fkey" FOREIGN KEY ("ceedId") REFERENCES "Ceed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "AvailableAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CeedRun" ADD CONSTRAINT "CeedRun_ceedId_fkey" FOREIGN KEY ("ceedId") REFERENCES "Ceed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CeedRunOutbox" ADD CONSTRAINT "CeedRunOutbox_ceedRunId_fkey" FOREIGN KEY ("ceedRunId") REFERENCES "CeedRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
