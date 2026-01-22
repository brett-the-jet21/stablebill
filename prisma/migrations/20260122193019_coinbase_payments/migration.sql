-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN "cryptoChargeId" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "cryptoHostedUrl" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "paidCurrency" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "paymentProvider" TEXT;
