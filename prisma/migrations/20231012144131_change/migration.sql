-- DropForeignKey
ALTER TABLE "bank_account_transactions" DROP CONSTRAINT "bank_account_transactions_destination_account_id_fkey";

-- DropForeignKey
ALTER TABLE "bank_account_transactions" DROP CONSTRAINT "bank_account_transactions_source_account_id_fkey";

-- DropForeignKey
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_user_id_fkey";

-- AlterTable
ALTER TABLE "bank_account_transactions" ALTER COLUMN "source_account_id" DROP NOT NULL,
ALTER COLUMN "destination_account_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "bank_accounts" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account_transactions" ADD CONSTRAINT "bank_account_transactions_source_account_id_fkey" FOREIGN KEY ("source_account_id") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account_transactions" ADD CONSTRAINT "bank_account_transactions_destination_account_id_fkey" FOREIGN KEY ("destination_account_id") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
