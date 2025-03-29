import React from 'react'
import Map from './Map'
import AddressProvider from './context/AddressContext'

const NearbyPharmacies = () => {
  return (
    <div className="min-h-screen bg-gray-50 mt-16"> {/* Added mt-16 for navbar spacing */}
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Nearby Pharmacies</h1>
          <p className="mt-1 text-sm text-gray-600">Find pharmacies in your area</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 h-[calc(100vh-200px)]">
            <AddressProvider>
              <Map />
            </AddressProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NearbyPharmacies
