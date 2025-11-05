import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ============ AUTH ROUTES ============

// Sign up
app.post("/make-server-d499b637/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: role || "client" },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Save user profile
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role: role || "client",
      createdAt: new Date().toISOString(),
      blocked: false,
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Error in signup route: ${error}`);
    return c.json({ error: "Signup failed" }, 500);
  }
});

// Get current user profile
app.get("/make-server-d499b637/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    return c.json({ profile: profile || { id: user.id, email: user.email, ...user.user_metadata } });
  } catch (error) {
    console.log(`Error getting profile: ${error}`);
    return c.json({ error: "Failed to get profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-d499b637/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { name, phone } = await c.req.json();
    const profile = await kv.get(`user:${user.id}`) || {};
    
    const updatedProfile = {
      ...profile,
      name: name || profile.name,
      phone: phone || profile.phone,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}`, updatedProfile);
    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log(`Error updating profile: ${error}`);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// ============ TICKET ROUTES ============

// Create ticket
app.post("/make-server-d499b637/tickets", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const ticketData = await c.req.json();
    const ticketId = `ticket:${Date.now()}`;
    const ticketNumber = `TKT-${Date.now().toString().slice(-8)}`;

    const ticket = {
      id: ticketId,
      ticketNumber,
      userId: user.id,
      ...ticketData,
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };

    await kv.set(ticketId, ticket);

    // Add to user's tickets list
    const userTickets = await kv.get(`user_tickets:${user.id}`) || [];
    await kv.set(`user_tickets:${user.id}`, [...userTickets, ticketId]);

    return c.json({ ticket });
  } catch (error) {
    console.log(`Error creating ticket: ${error}`);
    return c.json({ error: "Failed to create ticket" }, 500);
  }
});

// Get tickets (filtered by role)
app.get("/make-server-d499b637/tickets", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    const role = profile?.role || user.user_metadata?.role || "client";

    const category = c.req.query("category");
    const status = c.req.query("status");

    let tickets = [];

    if (role === "admin") {
      // Admin sees all tickets
      const allTickets = await kv.getByPrefix("ticket:");
      tickets = allTickets;
    } else if (role === "master") {
      // Master sees assigned tickets
      const assignedTickets = await kv.get(`master_tickets:${user.id}`) || [];
      tickets = await Promise.all(
        assignedTickets.map((id: string) => kv.get(id))
      );
      tickets = tickets.filter(Boolean);
    } else {
      // Client sees only their tickets
      const userTicketIds = await kv.get(`user_tickets:${user.id}`) || [];
      tickets = await Promise.all(
        userTicketIds.map((id: string) => kv.get(id))
      );
      tickets = tickets.filter(Boolean);
    }

    // Apply filters
    if (category) {
      tickets = tickets.filter((t: any) => t.deviceType === category);
    }
    if (status) {
      tickets = tickets.filter((t: any) => t.status === status);
    }

    // Sort by date (newest first)
    tickets.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ tickets });
  } catch (error) {
    console.log(`Error getting tickets: ${error}`);
    return c.json({ error: "Failed to get tickets" }, 500);
  }
});

// Update ticket
app.put("/make-server-d499b637/tickets/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const ticketId = c.req.param("id");
    const updates = await c.req.json();
    const ticket = await kv.get(ticketId);

    if (!ticket) {
      return c.json({ error: "Ticket not found" }, 404);
    }

    const profile = await kv.get(`user:${user.id}`);
    const role = profile?.role || user.user_metadata?.role || "client";

    // Check permissions
    if (role === "client" && ticket.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const updatedTicket = {
      ...ticket,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(ticketId, updatedTicket);
    return c.json({ ticket: updatedTicket });
  } catch (error) {
    console.log(`Error updating ticket: ${error}`);
    return c.json({ error: "Failed to update ticket" }, 500);
  }
});

// Add comment to ticket
app.post("/make-server-d499b637/tickets/:id/comments", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const ticketId = c.req.param("id");
    const { text } = await c.req.json();
    const ticket = await kv.get(ticketId);

    if (!ticket) {
      return c.json({ error: "Ticket not found" }, 404);
    }

    const profile = await kv.get(`user:${user.id}`);
    const comment = {
      id: `comment:${Date.now()}`,
      userId: user.id,
      userName: profile?.name || user.email,
      text,
      createdAt: new Date().toISOString(),
    };

    ticket.comments = [...(ticket.comments || []), comment];
    ticket.updatedAt = new Date().toISOString();

    await kv.set(ticketId, ticket);
    return c.json({ ticket });
  } catch (error) {
    console.log(`Error adding comment: ${error}`);
    return c.json({ error: "Failed to add comment" }, 500);
  }
});

// Assign ticket to master (admin only)
app.post("/make-server-d499b637/tickets/:id/assign", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== "admin") {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const ticketId = c.req.param("id");
    const { masterId } = await c.req.json();
    const ticket = await kv.get(ticketId);

    if (!ticket) {
      return c.json({ error: "Ticket not found" }, 404);
    }

    ticket.assignedTo = masterId;
    ticket.status = "assigned";
    ticket.updatedAt = new Date().toISOString();

    await kv.set(ticketId, ticket);

    // Add to master's tickets
    const masterTickets = await kv.get(`master_tickets:${masterId}`) || [];
    if (!masterTickets.includes(ticketId)) {
      await kv.set(`master_tickets:${masterId}`, [...masterTickets, ticketId]);
    }

    return c.json({ ticket });
  } catch (error) {
    console.log(`Error assigning ticket: ${error}`);
    return c.json({ error: "Failed to assign ticket" }, 500);
  }
});

// ============ SERVICE ROUTES ============

// Get services
app.get("/make-server-d499b637/services", async (c) => {
  try {
    const services = await kv.getByPrefix("service:");
    return c.json({ services });
  } catch (error) {
    console.log(`Error getting services: ${error}`);
    return c.json({ error: "Failed to get services" }, 500);
  }
});

// Create service (admin only)
app.post("/make-server-d499b637/services", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== "admin") {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const serviceData = await c.req.json();
    const serviceId = `service:${Date.now()}`;

    const service = {
      id: serviceId,
      ...serviceData,
      createdAt: new Date().toISOString(),
    };

    await kv.set(serviceId, service);
    return c.json({ service });
  } catch (error) {
    console.log(`Error creating service: ${error}`);
    return c.json({ error: "Failed to create service" }, 500);
  }
});

// Update service (admin only)
app.put("/make-server-d499b637/services/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== "admin") {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const serviceId = c.req.param("id");
    const updates = await c.req.json();
    const service = await kv.get(serviceId);

    if (!service) {
      return c.json({ error: "Service not found" }, 404);
    }

    const updatedService = {
      ...service,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(serviceId, updatedService);
    return c.json({ service: updatedService });
  } catch (error) {
    console.log(`Error updating service: ${error}`);
    return c.json({ error: "Failed to update service" }, 500);
  }
});

// Delete service (admin only)
app.delete("/make-server-d499b637/services/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== "admin") {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const serviceId = c.req.param("id");
    await kv.del(serviceId);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting service: ${error}`);
    return c.json({ error: "Failed to delete service" }, 500);
  }
});

// ============ USER MANAGEMENT (ADMIN) ============

// Get all users (admin only)
app.get("/make-server-d499b637/users", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== "admin") {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const users = await kv.getByPrefix("user:");
    return c.json({ users });
  } catch (error) {
    console.log(`Error getting users: ${error}`);
    return c.json({ error: "Failed to get users" }, 500);
  }
});

// Block/unblock user (admin only)
app.put("/make-server-d499b637/users/:id/block", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== "admin") {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const userId = c.req.param("id");
    const { blocked } = await c.req.json();
    const targetUser = await kv.get(`user:${userId}`);

    if (!targetUser) {
      return c.json({ error: "User not found" }, 404);
    }

    targetUser.blocked = blocked;
    await kv.set(`user:${userId}`, targetUser);

    return c.json({ user: targetUser });
  } catch (error) {
    console.log(`Error blocking user: ${error}`);
    return c.json({ error: "Failed to block user" }, 500);
  }
});

// Get masters list (admin only)
app.get("/make-server-d499b637/masters", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== "admin") {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const allUsers = await kv.getByPrefix("user:");
    const masters = allUsers.filter((u: any) => u.role === "master");

    return c.json({ masters });
  } catch (error) {
    console.log(`Error getting masters: ${error}`);
    return c.json({ error: "Failed to get masters" }, 500);
  }
});

// ============ AUTH ADDITIONAL ROUTES ============

// Login
app.post("/make-server-d499b637/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Error during login: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    const profile = await kv.get(`user:${data.user.id}`);

    return c.json({ 
      session: data.session, 
      user: data.user,
      profile 
    });
  } catch (error) {
    console.log(`Error in login route: ${error}`);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Logout
app.post("/make-server-d499b637/logout", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (accessToken) {
      await supabase.auth.admin.signOut(accessToken);
    }
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error during logout: ${error}`);
    return c.json({ error: "Logout failed" }, 500);
  }
});

// Get session
app.get("/make-server-d499b637/session", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ session: null });
    }

    return c.json({ 
      session: { 
        user, 
        access_token: accessToken 
      } 
    });
  } catch (error) {
    console.log(`Error getting session: ${error}`);
    return c.json({ session: null });
  }
});

// ============ PDF REPORT GENERATION ============

app.post("/make-server-d499b637/generate-report", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { tickets, reportType, dateFrom, dateTo } = await c.req.json();

    // Import jsPDF
    const { jsPDF } = await import("npm:jspdf@2.5.1");
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('OTCHET PO ZAYAVKAM', 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    const reportTypeLabel = reportType === 'completed' ? 'ZAVERSHENNYЕ' : 
                            reportType === 'current' ? 'TEKUSHCHIE' : 'VSE';
    doc.text(`Tip: ${reportTypeLabel}`, 105, 22, { align: 'center' });
    
    if (dateFrom || dateTo) {
      const dateRange = `Period: ${dateFrom || 'nachalo'} - ${dateTo || 'konec'}`;
      doc.text(dateRange, 105, 28, { align: 'center' });
    }
    
    doc.text(`Data sozdaniya: ${new Date().toLocaleDateString('ru-RU')}`, 105, 34, { align: 'center' });
    
    // Summary
    doc.setFontSize(12);
    doc.text('STATISTIKA:', 20, 45);
    doc.setFontSize(10);
    doc.text(`Vsego zayavok: ${tickets.length}`, 20, 52);
    
    const stats = {
      new: tickets.filter((t: any) => t.status === 'new').length,
      assigned: tickets.filter((t: any) => t.status === 'assigned').length,
      inProgress: tickets.filter((t: any) => t.status === 'in_progress').length,
      completed: tickets.filter((t: any) => t.status === 'completed').length,
      cancelled: tickets.filter((t: any) => t.status === 'cancelled').length,
    };
    
    let yPos = 58;
    doc.text(`Novyh: ${stats.new}`, 20, yPos);
    yPos += 6;
    doc.text(`Naznacheno: ${stats.assigned}`, 20, yPos);
    yPos += 6;
    doc.text(`V rabote: ${stats.inProgress}`, 20, yPos);
    yPos += 6;
    doc.text(`Zaversheno: ${stats.completed}`, 20, yPos);
    yPos += 6;
    doc.text(`Otmeneno: ${stats.cancelled}`, 20, yPos);
    
    // Tickets list
    yPos += 12;
    doc.setFontSize(12);
    doc.text('SPISOK ZAYAVOK:', 20, yPos);
    yPos += 8;
    
    const statusLabels: Record<string, string> = {
      new: 'NOVAYA',
      assigned: 'NAZNACHENA',
      in_progress: 'V RABOTE',
      completed: 'ZAVERSHENA',
      cancelled: 'OTMENENA',
    };

    const deviceLabels: Record<string, string> = {
      smartphone: 'SMARTFON',
      tablet: 'PLANSHET',
      laptop: 'NOUTBUK',
      pc: 'PK',
      console: 'KONSOL',
      other: 'DRUGOE',
    };
    
    doc.setFontSize(8);
    tickets.forEach((ticket: any, index: number) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(9);
      doc.text(`${index + 1}. ${ticket.ticketNumber}`, 20, yPos);
      yPos += 5;
      
      doc.setFontSize(8);
      doc.text(`Status: ${statusLabels[ticket.status] || ticket.status}`, 25, yPos);
      yPos += 4;
      doc.text(`Ustroystvo: ${deviceLabels[ticket.deviceType] || ticket.deviceType}`, 25, yPos);
      yPos += 4;
      doc.text(`Model: ${ticket.brand} ${ticket.model}`, 25, yPos);
      yPos += 4;
      doc.text(`Data: ${new Date(ticket.createdAt).toLocaleDateString('ru-RU')}`, 25, yPos);
      yPos += 4;
      
      if (ticket.problem && ticket.problem.length < 100) {
        const problemText = ticket.problem.substring(0, 80) + (ticket.problem.length > 80 ? '...' : '');
        doc.text(`Problema: ${problemText}`, 25, yPos);
        yPos += 4;
      }
      
      yPos += 4;
    });
    
    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Stranitsa ${i} iz ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    const pdfOutput = doc.output('arraybuffer');
    
    return new Response(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report_${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.log(`Error generating PDF report: ${error}`);
    return c.json({ error: "Failed to generate report" }, 500);
  }
});

// Health check
app.get("/make-server-d499b637/health", (c) => {
  return c.json({ status: "OK", timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
