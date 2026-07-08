import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?search=${query}`);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        height: "56px",
        backgroundColor: "#0f0f0f",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        gap: "8px",
      }}
    >
      {/* ── LEFT ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          minWidth: "180px",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={toggleSidebar}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#272727")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          {/* 3 lines icon */}
          <div>
            <div
              style={{
                width: "18px",
                height: "2px",
                backgroundColor: "white",
                marginBottom: "4px",
              }}
            />
            <div
              style={{
                width: "18px",
                height: "2px",
                backgroundColor: "white",
                marginBottom: "4px",
              }}
            />
            <div
              style={{ width: "18px", height: "2px", backgroundColor: "white" }}
            />
          </div>
        </button>

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <svg height="20" viewBox="0 0 90 20" style={{ marginRight: "2px" }}>
            <g>
              <path
                d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
                fill="#FF0000"
              />
              <path
                d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z"
                fill="white"
              />
            </g>
            <g>
              <path
                d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z"
                fill="white"
              />
              <path
                d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.96297 40.315 8.15746C40.5878 7.35195 41.0135 6.75929 41.592 6.37976C42.1706 6.00023 42.9302 5.81046 43.871 5.81046C44.7976 5.81046 45.5384 6.00023 46.0981 6.37976C46.6555 6.75929 47.0647 7.35195 47.3233 8.15746C47.5819 8.96297 47.7113 10.0422 47.7113 11.3898V13.2078C47.7113 14.5437 47.5842 15.6161 47.3303 16.4251C47.0764 17.2365 46.6695 17.8292 46.10 18.2097C45.5313 18.5903 44.7764 18.7847 43.836 18.7847C42.8727 18.7847 42.1026 18.5903 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8161 44.8705 15.1575 44.8705 14.2567V10.3347C44.8705 9.46337 44.7929 8.81662 44.6353 8.40424C44.4777 7.99186 44.2026 7.78567 43.8032 7.78567C43.4178 7.78567 43.1497 7.99186 42.9992 8.40424C42.8463 8.81662 42.771 9.46337 42.771 10.3347V14.2567C42.771 15.1575 42.8416 15.8161 42.9851 16.2323C43.131 16.651 43.4015 16.857 43.8032 16.857C44.2026 16.857 44.4777 16.651 44.6353 16.2323Z"
                fill="white"
              />
              <path
                d="M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z"
                fill="white"
              />
              <path
                d="M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z"
                fill="white"
              />
              <path
                d="M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z"
                fill="white"
              />
              <path
                d="M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90835 75.7148 7.38285H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73543 77.9303 9.26572C77.9914 9.79601 78.022 10.5528 78.022 11.5348V13.1492H78.0243Z"
                fill="white"
              />
              <path
                d="M84.8657 13.8712C84.8657 14.6755 84.8892 15.2776 84.9363 15.6798C84.9833 16.0819 85.0821 16.3736 85.2326 16.5594C85.3831 16.7428 85.6136 16.8345 85.9264 16.8345C86.3474 16.8345 86.639 16.6699 86.7942 16.343C86.9518 16.0161 87.0365 15.4705 87.0506 14.7085L89.4824 14.8519C89.4965 14.9601 89.5035 15.1105 89.5035 15.3011C89.5035 16.4582 89.186 17.3237 88.5506 17.8952C87.9152 18.4667 87.0247 18.7536 85.8676 18.7536C84.4777 18.7536 83.504 18.3185 82.9466 17.446C82.3869 16.5735 82.1094 15.2259 82.1094 13.4008V11.2136C82.1094 9.33452 82.3987 7.96105 82.9795 7.09558C83.5626 6.23014 84.5409 5.79742 85.9264 5.79742C86.8599 5.79742 87.5842 5.97381 88.0993 6.32658C88.617 6.67936 88.9839 7.24144 89.2003 8.02221C89.4167 8.80298 89.5261 9.88572 89.5261 11.2701V13.2317H84.8657V13.8712ZM85.2232 7.96811C85.0797 8.14449 84.9857 8.43377 84.9363 8.83202C84.8892 9.23027 84.8657 9.8419 84.8657 10.669V11.5912H87.0671V10.669C87.0671 9.85616 87.0412 9.24498 86.9918 8.83202C86.9424 8.41906 86.8435 8.12978 86.6930 5.96909C86.5424 7.81306 86.3309 7.78567 86.0769 7.78567C85.7852 7.78567 85.5664 7.84202 85.2232 7.96811Z"
                fill="white"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* ── MIDDLE: Search ── */}
      <div
        className="search-bar"
        style={{
          flex: 1,
          maxWidth: "640px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            flex: 1,
            height: "40px",
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            style={{
              flex: 1,
              height: "100%",
              padding: "0 16px",
              backgroundColor: "#121212",
              border: "1px solid #303030",
              borderRight: "none",
              borderRadius: "40px 0 0 40px",
              color: "white",
              fontSize: "16px",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#1c62b9";
              e.target.style.backgroundColor = "#0f0f0f";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#303030";
              e.target.style.backgroundColor = "#121212";
            }}
          />
          <button
            type="submit"
            style={{
              width: "64px",
              height: "100%",
              backgroundColor: "#272727",
              border: "1px solid #303030",
              borderLeft: "none",
              borderRadius: "0 40px 40px 0",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3f3f3f")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#272727")
            }
          >
            {/* Search icon SVG */}
            <svg
              viewBox="0 0 24 24"
              style={{ width: "22px", height: "22px", fill: "white" }}
            >
              <path d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
            </svg>
          </button>
        </form>

        {/* Mic button */}
        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#272727",
            border: "none",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#3f3f3f")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#272727")
          }
        >
          <svg
            viewBox="0 0 24 24"
            style={{ width: "22px", height: "22px", fill: "white" }}
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>
      </div>

      {/* ── RIGHT ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          minWidth: "fit-content",
        }}
      >
        {user ? (
          <>
            {/* Create button */}
            <button
              onClick={() => navigate("/upload")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 16px",
                height: "36px",
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                borderRadius: "18px",
                fontSize: "14px",
                fontWeight: "500",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#272727")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {/* Plus icon */}
              <svg
                viewBox="0 0 24 24"
                style={{ width: "16px", height: "16px", fill: "white" }}
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Create
            </button>

            {/* Notification */}
            <button
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#272727")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <svg
                viewBox="0 0 24 24"
                style={{ width: "22px", height: "22px", fill: "white" }}
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </button>

            {/* Avatar + Dropdown */}
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#ff0000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "500",
                  fontSize: "14px",
                  cursor: "pointer",
                  userSelect: "none",
                  marginLeft: "4px",
                }}
              >
                {user.username?.[0]?.toUpperCase()}
              </div>

              {showDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    onClick={() => setShowDropdown(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      zIndex: 99,
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "44px",
                      backgroundColor: "#212121",
                      border: "1px solid #383838",
                      borderRadius: "12px",
                      width: "240px",
                      zIndex: 100,
                      overflow: "hidden",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
                    }}
                  >
                    {/* User info */}
                    <div
                      style={{
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        borderBottom: "1px solid #383838",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#ff0000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "500",
                          fontSize: "18px",
                          flexShrink: 0,
                        }}
                      >
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <p
                          style={{
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "500",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.username}
                        </p>
                        <p
                          style={{
                            color: "#aaa",
                            fontSize: "13px",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu items */}
                    {[
                      {
                        icon: "👤",
                        label: "Your channel",
                        action: async () => {
                          setShowDropdown(false);
                          // fetch the actual channel ID first
                          try {
                            const res = await fetch(
                              "http://localhost:5000/api/channels/mine",
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              },
                            );
                            const data = await res.json();
                            if (data && data._id) {
                              navigate(`/channel/${data._id}`);
                            } else {
                              navigate("/create-channel");
                            }
                          } catch (err) {
                            navigate("/channel/mine");
                          }
                        },
                      },
                      {
                        icon: "➕",
                        label: "Create channel",
                        action: () => {
                          navigate("/create-channel");
                          setShowDropdown(false);
                        },
                      },
                      {
                        icon: "⬆️",
                        label: "Upload video",
                        action: () => {
                          navigate("/upload");
                          setShowDropdown(false);
                        },
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        onClick={item.action}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          padding: "10px 16px",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "14px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#3f3f3f")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <span
                          style={{
                            fontSize: "18px",
                            width: "24px",
                            textAlign: "center",
                          }}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                    ))}

                    <div style={{ borderTop: "1px solid #383838" }}>
                      <div
                        onClick={handleLogout}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          padding: "10px 16px",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "14px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#3f3f3f")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          style={{
                            width: "20px",
                            height: "20px",
                            fill: "white",
                          }}
                        >
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        <span>Sign out</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 16px",
              height: "36px",
              backgroundColor: "transparent",
              border: "1px solid #3ea6ff",
              borderRadius: "18px",
              color: "#3ea6ff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#263850")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <svg
              viewBox="0 0 24 24"
              style={{ width: "20px", height: "20px", fill: "#3ea6ff" }}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
