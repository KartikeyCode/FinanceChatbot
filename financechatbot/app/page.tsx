import FinancialChatbot from "@/app/components/FinancialChatbot";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Analysis Bot</h1>
          <p className="mt-2 text-gray-600">
            Upload your financial data and get AI-powered insights
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              How it works
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Upload your Excel file with financial transactions</li>
              <li>Our AI will analyze your spending patterns</li>
              <li>Get personalized recommendations to improve your finances</li>
            </ol>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Start your analysis
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <FinancialChatbot />
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Supported File Formats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Excel (.xlsx)</h3>
              </div>
              <p className="text-sm text-gray-500">
                Standard Excel format with transaction data
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-2 rounded-md mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">CSV</h3>
              </div>
              <p className="text-sm text-gray-500">
                Comma-separated values with financial data
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 p-2 rounded-md mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Excel (.xls)</h3>
              </div>
              <p className="text-sm text-gray-500">
                Legacy Excel format (97-2003)
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Financial Analysis Bot. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}