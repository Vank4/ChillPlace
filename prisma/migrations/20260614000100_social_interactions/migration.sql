CREATE TABLE `saved_posts` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_id` INTEGER NOT NULL,
  `post_id` INTEGER NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `saved_posts_user_id_post_id_key`(`user_id`, `post_id`),
  INDEX `saved_posts_user_id_created_at_idx`(`user_id`, `created_at`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `review_replies` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `review_id` INTEGER NOT NULL,
  `user_id` INTEGER NOT NULL,
  `content` TEXT NOT NULL,
  `status` ENUM(
    'pending',
    'approved',
    'rejected',
    'active',
    'inactive',
    'hidden',
    'blocked',
    'merged',
    'deleted'
  ) NOT NULL DEFAULT 'approved',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `review_replies_review_id_key`(`review_id`),
  INDEX `review_replies_user_id_idx`(`user_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `saved_posts`
  ADD CONSTRAINT `saved_posts_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `saved_posts`
  ADD CONSTRAINT `saved_posts_post_id_fkey`
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `review_replies`
  ADD CONSTRAINT `review_replies_review_id_fkey`
  FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `review_replies`
  ADD CONSTRAINT `review_replies_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
