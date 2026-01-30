module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/web/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$web$2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/web/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$web$2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'error',
        'warn'
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
const __TURBOPACK__default__export__ = prisma;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[project]/web/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPasswordResetToken",
    ()=>createPasswordResetToken,
    "createSession",
    ()=>createSession,
    "deleteSession",
    ()=>deleteSession,
    "deleteUserSessions",
    ()=>deleteUserSessions,
    "generateToken",
    ()=>generateToken,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getSessionFromCookie",
    ()=>getSessionFromCookie,
    "hashPassword",
    ()=>hashPassword,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "register",
    ()=>register,
    "resetPassword",
    ()=>resetPassword,
    "verifyPassword",
    ()=>verifyPassword,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/src/lib/db.ts [app-route] (ecmascript)");
;
;
;
;
const JWT_SECRET = process.env.JWT_SECRET || 'hazop-labs-secret-key-change-in-production';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 12);
}
async function verifyPassword(password, hash) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hash);
}
function generateToken(userId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
        userId
    }, JWT_SECRET, {
        expiresIn: '7d'
    });
}
function verifyToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
    } catch  {
        return null;
    }
}
async function createSession(userId, userAgent, ipAddress) {
    const token = generateToken(userId);
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    const session = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].session.create({
        data: {
            userId,
            token,
            userAgent,
            ipAddress,
            expiresAt
        }
    });
    return session;
}
async function deleteSession(token) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].session.delete({
        where: {
            token
        }
    }).catch(()=>{});
}
async function deleteUserSessions(userId) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].session.deleteMany({
        where: {
            userId
        }
    });
}
async function getSessionFromCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    const session = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].session.findUnique({
        where: {
            token
        }
    });
    if (!session || session.expiresAt < new Date()) {
        if (session) await deleteSession(token);
        return null;
    }
    return session;
}
async function getCurrentUser() {
    const session = await getSessionFromCookie();
    if (!session) return null;
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.findUnique({
        where: {
            id: session.userId
        },
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            platformRole: true
        }
    });
    return user;
}
async function register(email, password, name) {
    // Check if user exists
    const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.findUnique({
        where: {
            email: email.toLowerCase()
        }
    });
    if (existingUser) {
        return {
            error: 'Un compte avec cet email existe déjà'
        };
    }
    // Validate password
    if (password.length < 8) {
        return {
            error: 'Le mot de passe doit contenir au moins 8 caractères'
        };
    }
    // Create user
    const passwordHash = await hashPassword(password);
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.create({
        data: {
            email: email.toLowerCase(),
            name,
            passwordHash
        },
        select: {
            id: true,
            email: true,
            name: true,
            platformRole: true
        }
    });
    // Create session
    const session = await createSession(user.id);
    return {
        user,
        token: session.token
    };
}
async function login(email, password, userAgent, ipAddress) {
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.findUnique({
        where: {
            email: email.toLowerCase()
        }
    });
    if (!user) {
        return {
            error: 'Email ou mot de passe incorrect'
        };
    }
    if (!user.isActive) {
        return {
            error: 'Ce compte a été désactivé'
        };
    }
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
        return {
            error: 'Email ou mot de passe incorrect'
        };
    }
    const session = await createSession(user.id, userAgent, ipAddress);
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            platformRole: user.platformRole
        },
        token: session.token
    };
}
async function logout() {
    const session = await getSessionFromCookie();
    if (session) {
        await deleteSession(session.token);
    }
}
async function createPasswordResetToken(email) {
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.findUnique({
        where: {
            email: email.toLowerCase()
        }
    });
    if (!user) return null;
    // Delete existing tokens
    await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].passwordResetToken.deleteMany({
        where: {
            userId: user.id
        }
    });
    // Create new token
    const token = crypto.randomUUID();
    await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].passwordResetToken.create({
        data: {
            userId: user.id,
            token,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        }
    });
    return token;
}
async function resetPassword(token, newPassword) {
    const resetToken = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].passwordResetToken.findUnique({
        where: {
            token
        },
        include: {
            user: true
        }
    });
    if (!resetToken) {
        return {
            success: false,
            error: 'Token invalide'
        };
    }
    if (resetToken.expiresAt < new Date()) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].passwordResetToken.delete({
            where: {
                id: resetToken.id
            }
        });
        return {
            success: false,
            error: 'Token expiré'
        };
    }
    if (resetToken.usedAt) {
        return {
            success: false,
            error: 'Token déjà utilisé'
        };
    }
    if (newPassword.length < 8) {
        return {
            success: false,
            error: 'Le mot de passe doit contenir au moins 8 caractères'
        };
    }
    const passwordHash = await hashPassword(newPassword);
    await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].$transaction([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.update({
            where: {
                id: resetToken.userId
            },
            data: {
                passwordHash
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].passwordResetToken.update({
            where: {
                id: resetToken.id
            },
            data: {
                usedAt: new Date()
            }
        }),
        // Invalidate all sessions
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].session.deleteMany({
            where: {
                userId: resetToken.userId
            }
        })
    ]);
    return {
        success: true
    };
}
}),
"[project]/web/src/app/api/projects/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/src/lib/auth.ts [app-route] (ecmascript)");
;
;
;
async function GET() {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Get projects from organizations the user is a member of
        const memberships = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].organizationMember.findMany({
            where: {
                userId: user.id
            },
            select: {
                organizationId: true
            }
        });
        const orgIds = memberships.map((m)=>m.organizationId);
        const projects = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].project.findMany({
            where: {
                organizationId: {
                    in: orgIds
                }
            },
            include: {
                _count: {
                    select: {
                        nodes: true
                    }
                },
                organization: {
                    select: {
                        name: true,
                        slug: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            projects
        });
    } catch (error) {
        console.error('Get projects error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch projects'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const { name, description, organizationId, status } = await request.json();
        if (!name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Project name is required'
            }, {
                status: 400
            });
        }
        if (!organizationId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Organization is required'
            }, {
                status: 400
            });
        }
        // Verify user is a member of the organization with create permissions
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].organizationMember.findUnique({
            where: {
                organizationId_userId: {
                    organizationId,
                    userId: user.id
                }
            }
        });
        if (!membership) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Not a member of this organization'
            }, {
                status: 403
            });
        }
        // Viewers cannot create projects
        if (membership.role === 'VIEWER') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Viewers cannot create projects'
            }, {
                status: 403
            });
        }
        const project = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].project.create({
            data: {
                name,
                description: description || '',
                organizationId,
                createdById: user.id,
                status: status || 'DRAFT'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(project, {
            status: 201
        });
    } catch (error) {
        console.error('Create project error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create project'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__212936d6._.js.map