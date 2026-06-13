-- AlterTable
ALTER TABLE `users`
    ADD COLUMN `phone` VARCHAR(30) NULL,
    ADD COLUMN `cover_url` TEXT NULL,
    ADD COLUMN `location` VARCHAR(120) NULL;

-- CreateIndex
CREATE INDEX `users_role_status_idx` ON `users`(`role`, `status`);
