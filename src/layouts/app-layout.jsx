import Header from "@/components/header";
import { Outlet } from "react-router-dom"

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen w-full max-w-7xl mx-auto px-10">

        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">Made with Prathamesh@2025</div>
    </div>
  )
}

export default AppLayout;
