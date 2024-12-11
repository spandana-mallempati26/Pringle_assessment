'use client';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, Spacer } from '@nextui-org/react';
import Image from 'next/image';
import { useState } from 'react';

type Params = {
  name: string;
  id: string;
};

type ProductInfoResponse = {
  id: number;
  name: string;
  category: string;
  description: string;
  payload?: string;
  reachRange?: string;
  applications?: string[];
  license: string;
  licenseDetails: string;
};

type RepairInstructionsResponse = {
  instructions: string[];
};

type BillOfMaterialsResponse = {
  materials: string[];
};

type CADModelResponse = {
 
  partNumber: string;
  id: number;
  name: string;
  category: string;
  dimensions: string;
  weight: string;
  material: string;
  color: string;
  manufacturer: string;
  
  fileFormat: string;
  modelType: string;
};

type LicenseInfoResponse = {
  id: number;
  name: string;
  category: string;
  license: string;
  licenseDetails: string;
};

type SafetyInfoResponse = {
  safetyFeatures: string[];
  safetyInstructions: string[];
};

type ApiResponse = ProductInfoResponse | RepairInstructionsResponse | BillOfMaterialsResponse | CADModelResponse | LicenseInfoResponse | SafetyInfoResponse | string;

const AssetDetails = () => {
  const params = useParams<Params>();
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!params || !params.id || !params.name) {
    return <p>Asset not found</p>;
  }

  const decodedName = decodeURIComponent(params.name);
  const decodedId = params.id;

  const fetchData = async (endpoint: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
     // sends a get request to API based on decodedId
      const response = await fetch(
        `https://localhost:7283/api/Assets/${endpoint}/${decodedId}`
      );
      // If API requests fails
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}. Status: ${response.status}`);
      }
      // parses json response and updates apiresponse with formatted data
      const data = await response.json();
      console.log(`Response from ${endpoint}:`, data);
       // formats data based on endpoint
      const formattedData = formatResponseData(endpoint, data);
      setApiResponse(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatResponseData = (endpoint: string, data: ApiResponse): React.ReactNode => {
    switch (endpoint) {
      case 'ProductInfo': {
        const productInfo = data as ProductInfoResponse;
        return (
          // displaying data inside a styled card
          <Card className="p-4">
            <h3><strong>Product Information</strong></h3>
            <p><strong>Name:</strong> {productInfo.name || 'N/A'}</p>
            <p><strong>Category:</strong> {productInfo.category || 'N/A'}</p>
            <p><strong>Description:</strong> {productInfo.description || 'N/A'}</p>
            {productInfo.payload && <p><strong>Payload:</strong> {productInfo.payload}</p>}
            {productInfo.reachRange && <p><strong>Reach Range:</strong> {productInfo.reachRange}</p>}
            {productInfo.applications && productInfo.applications.length > 0 && (
              <p><strong>Applications:</strong> {productInfo.applications.join(', ')}</p>
            )}
            <p><strong>License:</strong> {productInfo.license}</p>
            <p><strong>License Details:</strong> {productInfo.licenseDetails}</p>
          </Card>
        );
      }

      case 'RepairInstructions': {
        const repairInstructions = data as RepairInstructionsResponse;
        return (
          <Card className="p-4">
            <h3><strong>Repair Instructions </strong></h3>
            {repairInstructions.instructions.length > 0 ? (
              repairInstructions.instructions.map((instruction, index) => (
                <p key={index}>{instruction}</p>
              ))
            ) : (
              <p>No repair instructions available.</p>
            )}
          </Card>
        );
      }

      case 'BillOfMaterials': {
        const billOfMaterials = data as BillOfMaterialsResponse;
        return (
          <Card className="p-4">
            <h3><strong>Bill of Materials </strong></h3>
            {billOfMaterials.materials.length > 0 ? (
              billOfMaterials.materials.map((material, index) => (
                <p key={index}>{material}</p>
              ))
            ) : (
              <p>No materials available.</p>
            )}
          </Card>
        );
      }

      
      case 'CADModel': {
        const cadModel = data as CADModelResponse;
  
        return (
          <Card className="p-4">
            <h3><strong>CAD Model Details</strong></h3>
            <p><strong>Name:</strong> {cadModel.name || 'N/A'}</p>
            <p><strong>Category:</strong> {cadModel.category || 'N/A'}</p>
            <p><strong>Dimensions:</strong> {cadModel.dimensions || 'N/A'}</p>
            <p><strong>Weight:</strong> {cadModel.weight || 'N/A'}</p>
            <p><strong>Material:</strong> {cadModel.material || 'N/A'}</p>
            <p><strong>Color:</strong> {cadModel.color || 'N/A'}</p>
            <p><strong>Manufacturer:</strong> {cadModel.manufacturer || 'N/A'}</p>
            <p><strong>Part Number:</strong> {cadModel.partNumber || 'N/A'}</p>
            <p><strong>File Format:</strong> {cadModel.fileFormat || 'N/A'}</p>
            <p><strong>Model Type:</strong> {cadModel.modelType || 'N/A'}</p>
          </Card>
        );
      }
      
      
      

      case 'LicenseInfo': {
        const licenseInfo = data as LicenseInfoResponse;
        return (
          <Card className="p-4">
            <h3><strong>License Information </strong></h3>
            <p><strong>Name:</strong> {licenseInfo.name}</p>
            <p><strong>Category:</strong> {licenseInfo.category}</p>
            <p><strong>License:</strong> {licenseInfo.license}</p>
            <p><strong>License Details:</strong> {licenseInfo.licenseDetails}</p>
          </Card>
        );
      }

      case 'SafetyInfo': {
        const safetyInfo = data as SafetyInfoResponse;
        return (
          <Card className="p-4">
            <h3><strong>Safety Guidelines</strong></h3>
            <p>{safetyInfo.safetyFeatures}</p>
            <h3><strong>Safety Instructions</strong></h3>
            <p>{safetyInfo.safetyInstructions}</p>
          </Card>
        );
      }

      default:
        return <p>No data available for this category.</p>;
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
  <div className="flex w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
    <div className="flex flex-col items-center justify-center w-1/3 p-8">
      <div className="w-48 h-48 mb-6 overflow-hidden rounded-full border-4 border-black">
        <Image
          src={`/assets/images/${decodedName}.jpg`}
          alt={decodedName}
          width={192}
          height={192}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = '/assets/images/default.jpg')}
        />
          </div>
          <h2 className="text-xl font-semibold">{decodedName}</h2>
        </div>
        <div className="flex flex-col justify-center w-2/3 p-8 space-y-6"> {/* Increased padding for more height */}
          {['ProductInfo', 'RepairInstructions', 'BillOfMaterials', 'CADModel', 'LicenseInfo', 'SafetyInfo'].map(
            (endpoint, index) => (
              <Button
                key={endpoint}
                className={`${
                  index % 3 === 0// dynamically assigngs button colors
                    ? 'bg-red-500 text-white' // Red for first button
                    : index % 3 === 1
                    ? 'bg-yellow-500 text-white' // Yellow for second button
                    : 'bg-green-500 text-white' // Green for third button
                }`}
                size="md"
                variant="flat"
                disabled={loading}
                onClick={() => fetchData(endpoint)}
              >
                {loading ? 'Loading...' : `View ${endpoint}`}
              </Button>
            )
          )}
        </div>
      </div>
      {/* API Response display */}
      <div className="w-full max-w-4xl mt-8">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {apiResponse}
      </div>
      <Spacer y={2} />
      {/* Navigates back to the homepage */}
      <Button
        className="bg-blue-500 text-white"
        size="md"
        variant="flat"
        onClick={() => router.push('/')}
      >
        Back
      </Button>
    </div>
  );
};

export default AssetDetails;
