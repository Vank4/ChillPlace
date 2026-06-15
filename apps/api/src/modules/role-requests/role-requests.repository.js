import { prisma } from "../../common/utils/prisma.js";

const requestInclude = {
  user: {
    select: {
      id: true,
      username: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
      status: true
    }
  }
};

export function findPendingRoleRequest(userId, requestType) {
  return prisma.roleRequest.findFirst({
    where: { userId, requestType, status: "pending" }
  });
}

export function createRoleRequest(data) {
  return prisma.roleRequest.create({
    data,
    include: requestInclude
  });
}

export function listUserRoleRequests(userId) {
  return prisma.roleRequest.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }]
  });
}

export function listAdminRoleRequests(query) {
  const where = {
    ...(query.request_type ? { requestType: query.request_type } : {}),
    ...(query.status ? { status: query.status } : {})
  };
  return prisma.$transaction([
    prisma.roleRequest.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: requestInclude
    }),
    prisma.roleRequest.count({ where })
  ]);
}

export function findRoleRequest(id) {
  return prisma.roleRequest.findUnique({
    where: { id },
    include: requestInclude
  });
}

export async function decideRoleRequest({
  request,
  adminId,
  approved,
  adminNote
}) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.roleRequest.findUnique({
      where: { id: request.id }
    });
    if (!current || current.status !== "pending") return null;

    const nextStatus = approved ? "approved" : "rejected";
    if (approved) {
      await tx.user.update({
        where: { id: current.userId },
        data: { role: current.requestType }
      });
      const data = current.applicationData ?? {};
      if (current.requestType === "creator") {
        await tx.creatorProfile.upsert({
          where: { userId: current.userId },
          update: {
            displayName: data.displayName,
            bio: data.bio,
            socialLinks: data.socialLinks
          },
          create: {
            userId: current.userId,
            displayName: data.displayName,
            bio: data.bio,
            socialLinks: data.socialLinks
          }
        });
      } else {
        await tx.businessProfile.upsert({
          where: { userId: current.userId },
          update: {
            businessName: data.businessName,
            slug: data.slug,
            phone: data.phone,
            address: data.address,
            status: "approved",
            verifiedAt: new Date()
          },
          create: {
            userId: current.userId,
            businessName: data.businessName,
            slug: data.slug,
            phone: data.phone,
            address: data.address,
            status: "approved",
            verifiedAt: new Date()
          }
        });
      }
    }

    const updated = await tx.roleRequest.update({
      where: { id: current.id },
      data: {
        status: nextStatus,
        adminNote,
        reviewedBy: adminId,
        reviewedAt: new Date()
      }
    });
    await tx.notification.create({
      data: {
        userId: current.userId,
        type: approved ? "role_request_approved" : "role_request_rejected",
        title: approved
          ? "Yêu cầu nâng cấp tài khoản đã được duyệt"
          : "Yêu cầu nâng cấp tài khoản đã bị từ chối",
        body: adminNote,
        dataJson: {
          roleRequestId: current.id,
          requestType: current.requestType
        }
      }
    });
    await tx.auditLog.create({
      data: {
        adminId,
        action: approved ? "role_request.approve" : "role_request.reject",
        targetType: "role_request",
        targetId: current.id,
        beforeJson: { status: current.status },
        afterJson: {
          status: nextStatus,
          requestType: current.requestType,
          userId: current.userId
        }
      }
    });
    return updated;
  });
}
