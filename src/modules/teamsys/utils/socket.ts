import { Server, Socket } from "socket.io";
import type http from "http";

const userSockets = new Map<string, Set<string>>();
let io: Server | null = null;

// Llamado desde el index.ts global
export function initTeamsysSocketServer(server: http.Server, allowedOrigins: string[]) {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : "*",
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("🔌 [teamsys] Cliente conectado:", socket.id);

    socket.on("auth", (userId: string) => {
      if (!userId) return;
      console.log(`🔐 [teamsys] Socket ${socket.id} -> usuario ${userId}`);

      socket.data.userId = userId;

      let set = userSockets.get(userId);
      if (!set) {
        set = new Set();
        userSockets.set(userId, set);
      }
      set.add(socket.id);
    });

    socket.on("disconnect", () => {
      const userId = socket.data.userId as string | undefined;
      if (!userId) return;

      const set = userSockets.get(userId);
      if (!set) return;

      set.delete(socket.id);
      if (set.size === 0) userSockets.delete(userId);

      console.log(`❌ [teamsys] Socket ${socket.id} desconectado de usuario ${userId}`);
    });
  });

  console.log("✅ [teamsys] Socket.io inicializado");
}

// Lo usas en los controladores de teamsys
export function forceLogoutUser(userId: string, exceptSocketId?: string) {
  if (!io) return;
  const set = userSockets.get(userId);
  if (!set) return;

  console.log(`🚨 [teamsys] Expulsando sesiones del usuario ${userId}`);

  for (const id of set) {
    if (id === exceptSocketId) continue;
    io.to(id).emit("force-logout");
  }
}
