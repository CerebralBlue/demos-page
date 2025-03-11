import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function LandingCustomerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar fixed at the top */}
            <Navbar />

            {/* Main content with flex-grow to take up available space */}
            <div className="flex-grow mt-12">
                {children}
            </div>

            {/* Footer fixed at the bottom */}
            <Footer />
        </div>
    );
}
