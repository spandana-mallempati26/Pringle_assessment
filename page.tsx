'use client';
import './globals.css';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@nextui-org/react';

interface Asset {
  id: number;
  name: string;
  category: string;
}

const Home = () => {
  const [category, setCategory] = useState('Select Category');
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const router = useRouter();
  const assetDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Initializing assets
  useEffect(() => {
    setAssets([
      { id: 1, name: 'ABB IRB 6700', category: 'Industrial Robots' },
      { id: 2, name: 'KUKA KR AGILUS', category: 'Industrial Robots' },
      { id: 3, name: 'Da Vinci Surgical System', category: 'Medical Robots' },
      { id: 4, name: 'CyberKnife', category: 'Medical Robots' },
      { id: 5, name: 'Predator Drone', category: 'Military Robots' },
      { id: 6, name: 'PackBot', category: 'Military Robots' },
      { id: 7, name: 'Universal Robots UR5e', category: 'Industrial Robots' },
      { id: 8, name: 'MAKO Robotic Arm', category: 'Medical Robots' },
      { id: 9, name: 'BigDog', category: 'Military Robots' },
      { id: 10, name: 'TALON', category: 'Military Robots' },
      { id: 11, name: 'FANUC R-2000iC', category: 'Industrial Robots' },
      { id: 12, name: 'Yaskawa Motoman HC20DT', category: 'Industrial Robots' },
      { id: 13, name: 'Versius', category: 'Medical Robots' },
      { id: 14, name: 'ROSATM', category: 'Medical Robots' },
      { id: 15, name: 'SWORDS', category: 'Military Robots' },
    ]);
  }, []);

  // Updating filtered assets when category or search query changes
  useEffect(() => {
    if (category !== 'Select Category') {
      const filtered = assets.filter(
        (asset) =>
          asset.category === category &&
          asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets([]);
    }
  }, [searchQuery, category, assets]);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        assetDropdownRef.current &&
        !assetDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAssetDropdown(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // routing page to the requested asset
  const handleSearch = () => {
   /* if (category === 'Select Category') {
      alert('Please select a category first');
      return;
    }
    if (searchQuery.trim() === '') {
      alert('Please select or enter an asset');
      return;
    }*/
    const foundAsset = assets.find(
      (asset) =>
        asset.name.toLowerCase() === searchQuery.toLowerCase() &&
        asset.category === category
    );
    if (foundAsset) {
      router.push(`/assets/${encodeURIComponent(foundAsset.name)}/${foundAsset.id}`);
    } else {
      alert('No asset found');
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-start p-4 bg-gray-100">
      <video autoPlay muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src="/videos/bg.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center text-white space-y-8 pt-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 p-4 rounded shadow-lg">Welcome to the Robotic Assets Directory!</h1>
        <p className="text-xl mb-6 font-semibold text-gray-800 bg-gradient-to-r from-white via-[#D2B48C] to-white p-4 rounded shadow-md">
          Explore a variety of robotic assets tailored to industrial, medical, and military sectors. Select a category to view available assets.
        </p>

        {/* Category Dropdown */}
        <div className="w-80 mb-4 flex flex-col items-start space-y-2">
          <label className="text-lg text-gray-900"><strong>Category</strong></label>
          <div className="relative w-full" ref={categoryDropdownRef}>
            <div
              className="w-full text-left border px-4 py-2 rounded text-gray-700 bg-white shadow-md cursor-pointer"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              {category}
            </div>
            {showCategoryDropdown && (
              <div className="absolute w-full bg-white shadow-lg mt-2 border border-gray-200 rounded z-10">
                {['Industrial Robots', 'Medical Robots', 'Military Robots'].map((cat) => (
                  <div
                    key={cat}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-200 text-gray-700"
                    onClick={() => {
                      setCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Asset Search */}
        <div className="w-80 mb-4 flex flex-col items-start space-y-2">
          <label className="text-lg text-gray-900"><strong>Asset</strong></label>
          <div className="relative w-full" ref={assetDropdownRef}>
            <Input
              placeholder={
                category === 'Select Category' ? 'Select a category first' : 'Search or Select Asset'
              }
              value={category === 'Select Category' ? '' : searchQuery}
              onFocus={() => {
                if (category !== 'Select Category') {
                  setShowAssetDropdown(true);
                }
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={category === 'Select Category'}
              aria-label="Asset Search"
              className={`w-full border px-4 py-2 rounded text-gray-700 bg-white shadow-md ${
                category === 'Select Category' ? 'cursor-not-allowed opacity-50' : ''
              }`}
            />

            {showAssetDropdown && filteredAssets.length > 0 && (
              <div className="absolute w-full bg-white shadow-lg mt-2 border border-gray-200 rounded z-10">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="w-full text-left border cursor-pointer px-4 py-2 hover:bg-gray-200 text-gray-700"
                    onClick={() => {
                      setSearchQuery(asset.name);
                      setShowAssetDropdown(false);
                    }}
                  >
                    {asset.name}
                  </div>
                ))}
              </div>
            )}
            {showAssetDropdown && filteredAssets.length === 0 && (
              <div className="px-4 py-2 text-red-500">No asset found</div>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="w-80 flex justify-center">
          <Button
            onClick={handleSearch}
            disabled={category === 'Select Category' || searchQuery.trim() === ''}
            className={`${
              category === 'Select Category' || searchQuery.trim() === ''
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-800'
            } `}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
