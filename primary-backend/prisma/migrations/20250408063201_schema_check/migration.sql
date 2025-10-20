/*
  Warnings:

  - Made the column `triggerId` on table `Ceed` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "AvailableAction" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "AvailableTrigger" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Ceed" ALTER COLUMN "triggerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';
