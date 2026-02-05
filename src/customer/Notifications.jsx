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
        console.error("User not found:", userError);
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
        console.error("Error fetching notifications:", error);
        // If table doesn't exist, use sample data
        setNotifications(getSampleNotifications());
        setFilteredNotifications(getSampleNotifications());
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setNotifications(data);
        setFilteredNotifications(data);
      } else {
        // Use sample data if no notifications exist
        const sampleData = getSampleNotifications();
        setNotifications(sampleData);
        setFilteredNotifications(sampleData);
      }
    } catch (error) {
      console.error("Error in fetchNotifications:", error);
      setNotifications(getSampleNotifications());
      setFilteredNotifications(getSampleNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getSampleNotifications = () => {
    return [
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
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    // Type filter
    if (filterType !== "All") {
      filtered = filtered.filter((notif) => notif.type === filterType);
    }

    // Read status filter
    if (filterRead === "Unread") {
      filtered = filtered.filter((notif) => !notif.read);
    } else if (filterRead === "Read") {
      filtered = filtered.filter((notif) => notif.read);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (notif) =>
          notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notif.message.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationIds) => {
    try {
      if (notifications[0]?.user_id) {
        // If using real database
        const { error } = await supabase
          .from("notifications")
          .update({ read: true })
          .in("id", notificationIds);

        if (error) throw error;
      }

      setNotifications(
        notifications.map((notif) =>
          notificationIds.includes(notif.id) ? { ...notif, read: true } : notif,
        ),
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAsUnread = async (notificationIds) => {
    try {
      if (notifications[0]?.user_id) {
        const { error } = await supabase
          .from("notifications")
          .update({ read: false })
          .in("id", notificationIds);

        if (error) throw error;
      }

      setNotifications(
        notifications.map((notif) =>
          notificationIds.includes(notif.id)
            ? { ...notif, read: false }
            : notif,
        ),
      );
    } catch (error) {
      console.error("Error marking as unread:", error);
    }
  };

  const deleteNotifications = async (notificationIds) => {
    if (!confirm("Are you sure you want to delete these notifications?"))
      return;

    try {
      if (notifications[0]?.user_id) {
        const { error } = await supabase
          .from("notifications")
          .delete()
          .in("id", notificationIds);

        if (error) throw error;
      }

      setNotifications(
        notifications.filter((notif) => !notificationIds.includes(notif.id)),
      );
      setSelectedNotifications([]);
    } catch (error) {
      console.error("Error deleting notifications:", error);
    }
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  };

  const deleteAllRead = () => {
    const readIds = notifications.filter((n) => n.read).map((n) => n.id);
    if (readIds.length > 0) {
      deleteNotifications(readIds);
    }
  };

  const toggleSelectNotification = (id) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(
        selectedNotifications.filter((nid) => nid !== id),
      );
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const getNotificationIcon = (type) => {
    const iconProps = {
      className: "w-6 h-6",
    };

    switch (type) {
      case "Order":
        return <Package {...iconProps} />;
      case "Wishlist":
        return <Heart {...iconProps} />;
      case "Promotion":
        return <Gift {...iconProps} />;
      case "Review":
        return <Star {...iconProps} />;
      case "System":
        return <AlertCircle {...iconProps} />;
      case "Payment":
        return <CheckCircle {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getNotificationColor = (type) => {
    const colors = {
      Order: "bg-blue-100 text-blue-600",
      Wishlist: "bg-pink-100 text-pink-600",
      Promotion: "bg-purple-100 text-purple-600",
      Review: "bg-yellow-100 text-yellow-600",
      System: "bg-red-100 text-red-600",
      Payment: "bg-green-100 text-green-600",
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  const getPriorityBadge = (priority) => {
    if (priority === "high") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
          High
        </span>
      );
    } else if (priority === "medium") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
          Medium
        </span>
      );
    }
    return null;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const NotificationStats = () => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    const todayCount = notifications.filter((n) => {
      const notifDate = new Date(n.created_at);
      const today = new Date();
      return notifDate.toDateString() === today.toDateString();
    }).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-8 h-8 text-purple-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {notifications.length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total Notifications</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-8 h-8 text-pink-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {unreadCount}
            </span>
          </div>
          <p className="text-sm text-gray-600">Unread</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-purple-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {todayCount}
            </span>
          </div>
          <p className="text-sm text-gray-600">Today</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredNotifications.length}{" "}
                {filteredNotifications.length === 1
                  ? "notification"
                  : "notifications"}
              </p>
            </div>
            <Link
              to="/customer/dashboard"
              className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
            >
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </select>

            {/* Read Status Filter */}
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
            >
              {readFilters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter === "All" ? "All Status" : filter}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all text-sm font-medium flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={deleteAllRead}
              className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm font-medium flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All Read</span>
            </button>
            {selectedNotifications.length > 0 && (
              <>
                <button
                  onClick={() => markAsRead(selectedNotifications)}
                  className="px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all text-sm font-medium flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Selected Read</span>
                </button>
                <button
                  onClick={() => deleteNotifications(selectedNotifications)}
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm font-medium flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <NotificationStats />

        {/* Bulk Select */}
        {filteredNotifications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 flex items-center space-x-4">
            <input
              type="checkbox"
              checked={
                selectedNotifications.length === filteredNotifications.length
              }
              onChange={selectAll}
              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedNotifications.length > 0
                ? `${selectedNotifications.length} selected`
                : "Select all"}
            </span>
          </div>
        )}

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {notifications.length === 0
                ? "No notifications yet"
                : "No notifications found"}
            </h3>
            <p className="text-gray-600">
              {notifications.length === 0
                ? "We'll notify you when something new arrives!"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 ${
                  !notification.read ? "border-l-4 border-purple-500" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleSelectNotification(notification.id)}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer mt-1"
                  />

                  {/* Icon */}
                  <div
                    className={`shrink-0 w-12 h-12 rounded-xl ${getNotificationColor(
                      notification.type,
                    )} flex items-center justify-center`}
                  >
                    {getNotificationIcon(
                      notification.type,
                      notification.priority,
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3
                          className={`font-semibold ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                        )}
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          notification.type === "Order"
                            ? "bg-blue-50 text-blue-700"
                            : notification.type === "Promotion"
                              ? "bg-purple-50 text-purple-700"
                              : notification.type === "Wishlist"
                                ? "bg-pink-50 text-pink-700"
                                : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {notification.type}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    {!notification.read ? (
                      <button
                        onClick={() => markAsRead([notification.id])}
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsUnread([notification.id])}
                        className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all"
                        title="Mark as unread"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotifications([notification.id])}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
