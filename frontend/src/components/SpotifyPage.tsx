export function SpotifyPage() {
  return (
    <div className="bg-zinc-700 flex-1 flex flex-col">
      <nav className="w-full flex justify-between items-center">
        <div className="flex-1 flex justify-center gap-2 items-center">
          <button>Home</button>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="What do you want to read?"
            className="w-64 px-4 py-2 rounded-md"
          />
        </div>
        <div className="flex gap-2">
          <button>Alert</button>
          <button>Friends</button>
          <button>User</button>
        </div>
      </nav>
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex">
          {/* Left sidebar with fixed width */}
          <div className="w-64 bg-zinc-900 p-4">
            <h2 className="text-xl font-bold mb-4">Left Sidebar</h2>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-zinc-800 rounded-md cursor-pointer">
                Menu Item 1
              </li>
              <li className="p-2 hover:bg-zinc-800 rounded-md cursor-pointer">
                Menu Item 2
              </li>
              <li className="p-2 hover:bg-zinc-800 rounded-md cursor-pointer">
                Menu Item 3
              </li>
            </ul>
          </div>

          {/* Middle content area that grows to fill available space */}
          <div className="flex-1 bg-zinc-800 p-4">
            <h1 className="text-2xl font-bold mb-6">Main Content</h1>
            <p className="mb-4">
              This is the main content area that will grow to fill the available
              space between the two fixed-width sidebars.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-700 p-4 rounded-md">Content Card 1</div>
              <div className="bg-zinc-700 p-4 rounded-md">Content Card 2</div>
              <div className="bg-zinc-700 p-4 rounded-md">Content Card 3</div>
              <div className="bg-zinc-700 p-4 rounded-md">Content Card 4</div>
            </div>
          </div>

          {/* Right sidebar with fixed width */}
          <div className="w-64 bg-zinc-900 p-4">
            <h2 className="text-xl font-bold mb-4">Right Sidebar</h2>
            <div className="bg-zinc-800 p-3 rounded-md mb-4">
              <h3 className="font-medium mb-2">Recent Activity</h3>
              <p className="text-sm text-zinc-400">No recent activity</p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-md">
              <h3 className="font-medium mb-2">Suggestions</h3>
              <p className="text-sm text-zinc-400">No suggestions available</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
