import { prisma } from "../../common/utils/prisma.js";

export async function getAdminStatsData() {
  const [
    users,
    places,
    posts,
    comments,
    reports,
    roleRequests,
    tags,
    categories
  ] = await Promise.all([
    prisma.user.groupBy({ by: ["role", "status"], _count: { id: true } }),
    prisma.place.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.post.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.comment.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.report.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.roleRequest.groupBy({
      by: ["requestType", "status"],
      _count: { id: true }
    }),
    prisma.tag.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.category.groupBy({ by: ["status"], _count: { id: true } })
  ]);
  return {
    users,
    places,
    posts,
    comments,
    reports,
    roleRequests,
    tags,
    categories
  };
}

export function listAuditLogs(query) {
  const where = {
    ...(query.action ? { action: { contains: query.action } } : {}),
    ...(query.target_type ? { targetType: query.target_type } : {}),
    ...(query.admin_id ? { adminId: query.admin_id } : {})
  };
  return prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    }),
    prisma.auditLog.count({ where })
  ]);
}

export function listAdminUsers(query) {
  const where = {
    ...(query.role ? { role: query.role } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(query.q
      ? {
          OR: [
            { username: { contains: query.q } },
            { fullName: { contains: query.q } },
            { email: { contains: query.q } }
          ]
        }
      : {})
  };
  return prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.user.count({ where })
  ]);
}

export function findAdminUser(id) {
  return prisma.user.findUnique({ where: { id } });
}

export function countActiveAdmins() {
  return prisma.user.count({ where: { role: "admin", status: "active" } });
}

export async function updateUserStatusWithAudit(adminId, user, status) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: user.id },
      data: { status },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true
      }
    });
    await tx.auditLog.create({
      data: {
        adminId,
        action: "user.status.update",
        targetType: "user",
        targetId: user.id,
        beforeJson: { status: user.status },
        afterJson: { status }
      }
    });
    return updated;
  });
}

export function listAdminPlaces(query) {
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.q
      ? {
          OR: [
            { name: { contains: query.q } },
            { slug: { contains: query.q } },
            { address: { contains: query.q } },
            { city: { contains: query.q } }
          ]
        }
      : {})
  };
  return prisma.$transaction([
    prisma.place.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        category: true,
        business: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            status: true
          }
        },
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
            role: true
          }
        }
      }
    }),
    prisma.place.count({ where })
  ]);
}

export function findAdminPlace(id) {
  return prisma.place.findUnique({ where: { id } });
}

export async function updatePlaceStatusWithAudit(adminId, place, status) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.place.update({
      where: { id: place.id },
      data: { status }
    });
    await tx.auditLog.create({
      data: {
        adminId,
        action: "place.status.update",
        targetType: "place",
        targetId: place.id,
        beforeJson: { status: place.status },
        afterJson: { status }
      }
    });
    return updated;
  });
}

export function listAdminReports(query) {
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.target_type ? { targetType: query.target_type } : {})
  };
  return prisma.$transaction([
    prisma.report.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        }
      }
    }),
    prisma.report.count({ where })
  ]);
}

export function findAdminReport(id) {
  return prisma.report.findUnique({ where: { id } });
}

export async function resolveReportWithAudit(adminId, report, data) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.report.update({
      where: { id: report.id },
      data: {
        status: data.status,
        adminNote: data.adminNote,
        resolvedBy: adminId,
        resolvedAt: new Date()
      }
    });
    await tx.notification.create({
      data: {
        userId: report.reporterId,
        type: "report_resolved",
        title: "Báo cáo của bạn đã được xử lý",
        body: data.adminNote,
        dataJson: {
          reportId: report.id,
          resolution: data.resolution
        }
      }
    });
    await tx.auditLog.create({
      data: {
        adminId,
        action: "report.resolve",
        targetType: "report",
        targetId: report.id,
        beforeJson: { status: report.status },
        afterJson: {
          status: data.status,
          resolution: data.resolution,
          adminNote: data.adminNote
        }
      }
    });
    return updated;
  });
}

export async function updateContentStatusWithAudit(
  adminId,
  model,
  id,
  status
) {
  return prisma.$transaction(async (tx) => {
    const current = await tx[model].findUnique({ where: { id } });
    if (!current) return null;
    const updated = await tx[model].update({
      where: { id },
      data: { status }
    });
    if (model === "comment") {
      const commentCount = await tx.comment.count({
        where: { postId: current.postId, status: "approved" }
      });
      await tx.post.update({
        where: { id: current.postId },
        data: { commentCount }
      });
    }
    await tx.auditLog.create({
      data: {
        adminId,
        action: `${model}.status.update`,
        targetType: model,
        targetId: id,
        beforeJson: { status: current.status },
        afterJson: { status }
      }
    });
    return updated;
  });
}

export function listAdminTags(query) {
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.type ? { type: query.type } : {}),
    ...(query.q
      ? {
          OR: [
            { name: { contains: query.q } },
            { slug: { contains: query.q } }
          ]
        }
      : {})
  };
  return prisma.$transaction([
    prisma.tag.findMany({
      where,
      orderBy: [{ usageCount: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: { _count: { select: { posts: true, userPreference: true } } }
    }),
    prisma.tag.count({ where })
  ]);
}

export function findAdminTag(id) {
  return prisma.tag.findUnique({ where: { id } });
}

export async function updateTagStatusWithAudit(adminId, tag, status) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.tag.update({
      where: { id: tag.id },
      data: { status }
    });
    await tx.auditLog.create({
      data: {
        adminId,
        action: "tag.status.update",
        targetType: "tag",
        targetId: tag.id,
        beforeJson: { status: tag.status },
        afterJson: { status }
      }
    });
    return updated;
  });
}

export async function mergeTagsWithAudit(adminId, source, target) {
  return prisma.$transaction(async (tx) => {
    const sourcePosts = await tx.postTag.findMany({
      where: { tagId: source.id }
    });
    for (const item of sourcePosts) {
      await tx.postTag.upsert({
        where: {
          postId_tagId: { postId: item.postId, tagId: target.id }
        },
        update: {},
        create: { postId: item.postId, tagId: target.id }
      });
    }
    await tx.postTag.deleteMany({ where: { tagId: source.id } });

    const preferences = await tx.userTagPreference.findMany({
      where: { tagId: source.id }
    });
    for (const preference of preferences) {
      await tx.userTagPreference.upsert({
        where: {
          userId_tagId: { userId: preference.userId, tagId: target.id }
        },
        update: {
          score: { increment: preference.score },
          lastInteractedAt: preference.lastInteractedAt
        },
        create: {
          userId: preference.userId,
          tagId: target.id,
          score: preference.score,
          lastInteractedAt: preference.lastInteractedAt
        }
      });
    }
    await tx.userTagPreference.deleteMany({ where: { tagId: source.id } });

    const targetUsage = await tx.postTag.count({ where: { tagId: target.id } });
    await tx.tag.update({
      where: { id: target.id },
      data: { usageCount: targetUsage }
    });
    const merged = await tx.tag.update({
      where: { id: source.id },
      data: {
        status: "merged",
        mergedToTagId: target.id,
        usageCount: 0
      }
    });
    await tx.auditLog.create({
      data: {
        adminId,
        action: "tag.merge",
        targetType: "tag",
        targetId: source.id,
        beforeJson: {
          status: source.status,
          mergedToTagId: source.mergedToTagId
        },
        afterJson: {
          status: "merged",
          mergedToTagId: target.id
        }
      }
    });
    return { source: merged, targetId: target.id, usageCount: targetUsage };
  });
}

export function listAdminCategories(query) {
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.q
      ? {
          OR: [
            { name: { contains: query.q } },
            { slug: { contains: query.q } }
          ]
        }
      : {})
  };
  return prisma.$transaction([
    prisma.category.findMany({
      where,
      orderBy: [{ name: "asc" }, { id: "asc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: { _count: { select: { places: true } } }
    }),
    prisma.category.count({ where })
  ]);
}

export function findAdminCategory(id) {
  return prisma.category.findUnique({ where: { id } });
}

export async function createCategoryWithAudit(adminId, data) {
  return prisma.$transaction(async (tx) => {
    const category = await tx.category.create({ data });
    await tx.auditLog.create({
      data: {
        adminId,
        action: "category.create",
        targetType: "category",
        targetId: category.id,
        afterJson: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          parentId: category.parentId,
          status: category.status
        }
      }
    });
    return category;
  });
}

export async function updateCategoryWithAudit(adminId, category, data) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.category.update({
      where: { id: category.id },
      data
    });
    await tx.auditLog.create({
      data: {
        adminId,
        action: "category.update",
        targetType: "category",
        targetId: category.id,
        beforeJson: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          parentId: category.parentId,
          status: category.status
        },
        afterJson: {
          id: updated.id,
          name: updated.name,
          slug: updated.slug,
          icon: updated.icon,
          parentId: updated.parentId,
          status: updated.status
        }
      }
    });
    return updated;
  });
}
