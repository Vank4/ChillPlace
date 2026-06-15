ALTER TABLE `business_profiles`
  ADD COLUMN `slug` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `business_profiles_slug_key`
  ON `business_profiles`(`slug`);

ALTER TABLE `places`
  ADD COLUMN `menu_json` JSON NULL;
