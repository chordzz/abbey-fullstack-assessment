



"use client";

// import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen h-screen py-[5%] flex flex-col">
        <div className="w-fit mx-auto">
            {/* <Image src={logo} alt="inblox logo" /> */}
            <h1 className="text-[37px] text-[#191919] font-bold font-bricolage-grotesque">Abbey</h1>
        </div>
        <main className='flex-1 flex items-center justify-center'>
            <div className="bg-white max-w-[597px] w-[90%] md:w-[70%] xl:w-[50%] px-6 py-8 rounded-[10px] shadow-xs">
                {children}
            </div>
        </main>
    </div>
  );
}