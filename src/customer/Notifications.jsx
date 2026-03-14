import React, { useState, useEffect } from "react";
import {
  Bell,
  Package,
  ShoppingCart,
  Heart,
  Star,
  TrendingUp,
  Gift,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  Check,
  X,
  Filter,
  Search,
  Calendar,
  ArrowLeft,
  Clock,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [filterRead, setFilterRead] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const notificationTypes = [
    "All",
    "Order",
    "Wishlist",
    "Promotion",
    "Review",
    "System",
    "Payment",
  ];
  const readFilters = ["All", "Unread", "Read"];

  useEffect(() => {
    fetchUserAndNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterType, filterRead, searchQuery, notifications]);

  const fetchUserAndNotifications = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate("/login");
        return;
      }
      setUserId(user.id);
      await fetchNotifications(user.id);
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  };

  const fetchNotifications = async (currentUserId) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });
      if (error) {
        setNotifications(getSampleNotifications());
        setFilteredNotifications(getSampleNotifications());
        setLoading(false);
        return;
      }
      if (data && data.length > 0) {
        setNotifications(data);
        setFilteredNotifications(data);
      } else {
        const s = getSampleNotifications();
        setNotifications(s);
        setFilteredNotifications(s);
      }
    } catch (error) {
      setNotifications(getSampleNotifications());
      setFilteredNotifications(getSampleNotifications());
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const getSampleNotifications = () => [
    {
      id: 1,
      type: "Order",
      title: "Order Delivered",
      message: "Your order #ORD000123 has been delivered successfully!",
      read: false,
      created_at: new Date().toISOString(),
      priority: "high",
    },
    {
      id: 2,
      type: "Promotion",
      title: "50% Off Sale",
      message:
        "Don't miss our biggest sale of the season! Get 50% off on selected items.",
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      priority: "medium",
    },
    {
      id: 3,
      type: "Wishlist",
      title: "Price Drop Alert",
      message: "An item in your wishlist 'Summer Dress' is now 30% off!",
      read: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      priority: "medium",
    },
    {
      id: 4,
      type: "Order",
      title: "Order Shipped",
      message: "Your order #ORD000122 has been shipped and is on its way!",
      read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      priority: "high",
    },
    {
      id: 5,
      type: "Review",
      title: "Review Your Purchase",
      message:
        "How was your experience with 'Classic Denim Jacket'? Leave a review!",
      read: false,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      priority: "low",
    },
    {
      id: 6,
      type: "System",
      title: "Security Update",
      message:
        "Your password was changed successfully. If this wasn't you, please contact support.",
      read: true,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      priority: "high",
    },
    {
      id: 7,
      type: "Payment",
      title: "Payment Successful",
      message:
        "Your payment of $299.99 for order #ORD000123 was processed successfully.",
      read: true,
      created_at: new Date(Date.now() - 345600000).toISOString(),
      priority: "medium",
    },
    {
      id: 8,
      type: "Promotion",
      title: "New Arrivals",
      message:
        "Check out our latest collection of summer wear. Fresh styles just added!",
      read: false,
      created_at: new Date(Date.now() - 432000000).toISOString(),
      priority: "low",
    },
  ];

  const applyFilters = () => {
    let filtered = [...notifications];
    if (filterType !== "All")
      filtered = filtered.filter((n) => n.type === filterType);
    if (filterRead === "Unread") filtered = filtered.filter((n) => !n.read);
    else if (filterRead === "Read") filtered = filtered.filter((n) => n.read);
    if (searchQuery.trim())
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    setFilteredNotifications(filtered);
  };

  const markAsRead = async (ids) => {
    try {
      if (notifications[0]?.user_id) {
        const { error } = await supabase
          .from("notifications")
          .update({ read: true })
          .in("id", ids);
        if (error) throw error;
      }
      setNotifications(
        notifications.map((n) =>
          ids.includes(n.id) ? { ...n, read: true } : n,
        ),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const markAsUnread = async (ids) => {
    try {
      if (notifications[0]?.user_id) {
        const { error } = await supabase
          .from("notifications")
          .update({ read: false })
          .in("id", ids);
        if (error) throw error;
      }
      setNotifications(
        notifications.map((n) =>
          ids.includes(n.id) ? { ...n, read: false } : n,
        ),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNotifications = async (ids) => {
    if (!confirm("Are you sure you want to delete these notifications?"))
      return;
    try {
      if (notifications[0]?.user_id) {
        const { error } = await supabase
          .from("notifications")
          .delete()
          .in("id", ids);
        if (error) throw error;
      }
      setNotifications(notifications.filter((n) => !ids.includes(n.id)));
      setSelectedNotifications([]);
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = () => {
    const ids = notifications.filter((n) => !n.read).map((n) => n.id);
    if (ids.length) markAsRead(ids);
  };
  const deleteAllRead = () => {
    const ids = notifications.filter((n) => n.read).map((n) => n.id);
    if (ids.length) deleteNotifications(ids);
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    setSelectedNotifications(
      selectedNotifications.length === filteredNotifications.length
        ? []
        : filteredNotifications.map((n) => n.id),
    );
  };

  const getNotificationIcon = (type) => {
    const cls = "w-5 h-5";
    switch (type) {
      case "Order":
        return <Package className={cls} />;
      case "Wishlist":
        return <Heart className={cls} />;
      case "Promotion":
        return <Gift className={cls} />;
      case "Review":
        return <Star className={cls} />;
      case "System":
        return <AlertCircle className={cls} />;
      case "Payment":
        return <CheckCircle className={cls} />;
      default:
        return <Bell className={cls} />;
    }
  };

  const getTypeStyle = (type) => {
    const styles = {
      Order: {
        icon: "bg-blue-50 text-blue-600",
        badge: "bg-blue-50 text-blue-700",
      },
      Wishlist: {
        icon: "bg-rose-50 text-rose-500",
        badge: "bg-rose-50 text-rose-700",
      },
      Promotion: {
        icon: "bg-violet-50 text-violet-600",
        badge: "bg-violet-50 text-violet-700",
      },
      Review: {
        icon: "bg-amber-50 text-amber-600",
        badge: "bg-amber-50 text-amber-700",
      },
      System: {
        icon: "bg-red-50 text-red-600",
        badge: "bg-red-50 text-red-700",
      },
      Payment: {
        icon: "bg-green-50 text-green-600",
        badge: "bg-green-50 text-green-700",
      },
    };
    return (
      styles[type] || {
        icon: "bg-gray-100 text-gray-600",
        badge: "bg-gray-50 text-gray-700",
      }
    );
  };

  const getPriorityBadge = (priority) => {
    if (priority === "high")
      return (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-100">
          High
        </span>
      );
    if (priority === "medium")
      return (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-600 border border-amber-100">
          Medium
        </span>
      );
    return null;
  };

  const formatTimeAgo = (dateString) => {
    const diff = Date.now() - new Date(dateString);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const todayCount = notifications.filter(
    (n) => new Date(n.created_at).toDateString() === new Date().toDateString(),
  ).length;

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Title row */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Notifications
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {filteredNotifications.length}{" "}
                {filteredNotifications.length === 1
                  ? "notification"
                  : "notifications"}
              </p>
            </div>
            <Link
              to="/customer/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-300 transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none cursor-pointer transition-all text-gray-700"
            >
              {notificationTypes.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : t}
                </option>
              ))}
            </select>
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none cursor-pointer transition-all text-gray-700"
            >
              {readFilters.map((f) => (
                <option key={f} value={f}>
                  {f === "All" ? "All Status" : f}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-xs font-medium border border-green-100"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Mark All Read
            </button>
            <button
              onClick={deleteAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-medium border border-red-100"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete All Read
            </button>
            {selectedNotifications.length > 0 && (
              <>
                <button
                  onClick={() => markAsRead(selectedNotifications)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-xs font-medium border border-emerald-100"
                >
                  <Check className="w-3.5 h-3.5" /> Mark Selected Read
                </button>
                <button
                  onClick={() => deleteNotifications(selectedNotifications)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-medium border border-red-100"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total",
              value: notifications.length,
              icon: <Bell className="w-5 h-5 text-green-600" />,
              accent: "bg-green-50",
            },
            {
              label: "Unread",
              value: unreadCount,
              icon: <Mail className="w-5 h-5 text-emerald-600" />,
              accent: "bg-emerald-50",
            },
            {
              label: "Today",
              value: todayCount,
              icon: <Calendar className="w-5 h-5 text-green-700" />,
              accent: "bg-green-50",
            },
          ].map(({ label, value, icon, accent }) => (
            <div
              key={label}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center shrink-0`}
              >
                {icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk select bar */}
        {filteredNotifications.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mb-4 flex items-center gap-3 shadow-sm">
            <input
              type="checkbox"
              checked={
                selectedNotifications.length === filteredNotifications.length
              }
              onChange={selectAll}
              className="w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer"
            />
            <span className="text-sm text-gray-500 font-medium">
              {selectedNotifications.length > 0
                ? `${selectedNotifications.length} selected`
                : "Select all"}
            </span>
          </div>
        )}

        {/* Notification List */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading notifications…</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {notifications.length === 0
                ? "No notifications yet"
                : "No notifications found"}
            </h3>
            <p className="text-sm text-gray-400">
              {notifications.length === 0
                ? "We'll notify you when something new arrives!"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredNotifications.map((notification) => {
              const style = getTypeStyle(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-5 ${
                    !notification.read
                      ? "border-l-4 border-l-green-500 border-gray-100"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelectNotification(notification.id)}
                      className="w-4 h-4 mt-1 rounded border-gray-300 accent-green-600 cursor-pointer shrink-0"
                    />

                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.icon}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className={`text-sm font-semibold ${!notification.read ? "text-gray-900" : "text-gray-500"}`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                          )}
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mb-2.5">
                        {notification.message}
                      </p>
                      <span
                        className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${style.badge}`}
                      >
                        {notification.type}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {!notification.read ? (
                        <button
                          onClick={() => markAsRead([notification.id])}
                          className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => markAsUnread([notification.id])}
                          className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                          title="Mark as unread"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotifications([notification.id])}
                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
