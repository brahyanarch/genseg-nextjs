-- CreateTable
CREATE TABLE `project` (
    `id_project` INTEGER NOT NULL AUTO_INCREMENT,
    `name_project` VARCHAR(191) NOT NULL,
    `fecha_init` DATETIME(3) NOT NULL,
    `fecha_final` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_project`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
