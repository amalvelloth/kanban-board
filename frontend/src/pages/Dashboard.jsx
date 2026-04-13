import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DesktopMenu from "../components/DesktopMenu";
import { handleSuccess } from "../utils";

function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser") || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Loggedout");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const capitalizeFirstLetter = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getGreeting = () => {
    const hours = new Date().getHours();

    if (hours < 12) return "Good morning,";
    if (hours < 18) return "Good afternoon,";
    return "Good evening,";
  };

  const capitalizedUserName = capitalizeFirstLetter(loggedInUser);
  const greeting = getGreeting();

  return (
    <section className="flex min-h-screen bg-neutral-900 text-white">
      <DesktopMenu />

      <main className="flex-1 px-4 pb-8 pt-24 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
                Dashboard
              </p>
          <div className="flex flex-col-reverse gap-4 w-fit rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                  {greeting}{" "}
                  <span className="font-extrabold text-white">
                    {capitalizedUserName || "there"}
                  </span>
                </h1>
                <p className="text-base text-neutral-300 sm:text-lg">
                  Welcome back! Let&apos;s make progress today.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-white cursor-pointer px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
              >
                Log out
              </button>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-neutral-700 to-neutral-800 text-2xl font-bold uppercase sm:h-24 sm:w-24">
              {capitalizedUserName ? capitalizedUserName.charAt(0) : "U"}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-neutral-800/70 p-6">
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base">
                This space is now aligned to behave like a proper dashboard
                section, with content that stacks on small screens and sits
                comfortably beside the sidebar on larger screens.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-neutral-800/70 p-6">
              <h2 className="text-xl font-semibold">Quick Note</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300 sm:text-base">
                You can add cards in Task Control, then return here later for
                summaries or widgets.
              </p>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default Dashboard;
