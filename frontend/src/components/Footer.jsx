const Footer = () => {
    return (
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-center md:text-left">
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} Grownex. All rights reserved.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                            About
                        </a>
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                            Terms
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;