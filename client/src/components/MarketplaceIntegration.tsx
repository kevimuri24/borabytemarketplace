import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

interface MarketplaceStatus {
  connected: boolean;
  productsSynced: number;
  lastSync: string;
  syncStatus: string;
}

export default function MarketplaceIntegration() {
  const { data: amazonStatus, isLoading: amazonLoading } = useQuery<MarketplaceStatus>({
    queryKey: ['/api/marketplace/amazon/status'],
  });

  const { data: ebayStatus, isLoading: ebayLoading } = useQuery<MarketplaceStatus>({
    queryKey: ['/api/marketplace/ebay/status'],
  });

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: undefined,
      month: undefined,
      day: undefined,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <section className="mb-12 mt-16">
      <h2 className="text-2xl font-bold mb-6">Integrated Marketplaces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#232F3E] text-white p-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">Amazon Integration</h3>
            {amazonLoading ? (
              <div className="h-5 w-20 bg-gray-600 rounded-full animate-pulse"></div>
            ) : (
              <span className={`${amazonStatus?.connected ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-2 py-1 rounded-full`}>
                {amazonStatus?.connected ? 'Connected' : 'Disconnected'}
              </span>
            )}
          </div>
          <div className="p-6">
            {amazonLoading ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Products Synced</span>
                  <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Last Sync</span>
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Sync Status</span>
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Products Synced</span>
                  <span className="font-bold">{amazonStatus?.productsSynced.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Last Sync</span>
                  <span className="font-bold">Today, {amazonStatus && formatLastSync(amazonStatus.lastSync)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Sync Status</span>
                  <span className={`${amazonStatus?.syncStatus === 'up-to-date' ? 'text-green-600' : 'text-yellow-600'} font-bold`}>
                    {amazonStatus?.syncStatus === 'up-to-date' ? 'Up to date' : 'Updates Available'}
                  </span>
                </div>
              </>
            )}
            <Button className="w-full bg-[#FF9900] hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition mt-2">
              Manage Amazon Connection
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#232F3E] text-white p-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">eBay Integration</h3>
            {ebayLoading ? (
              <div className="h-5 w-20 bg-gray-600 rounded-full animate-pulse"></div>
            ) : (
              <span className={`${ebayStatus?.connected ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-2 py-1 rounded-full`}>
                {ebayStatus?.connected ? 'Connected' : 'Disconnected'}
              </span>
            )}
          </div>
          <div className="p-6">
            {ebayLoading ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Products Synced</span>
                  <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Last Sync</span>
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Sync Status</span>
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Products Synced</span>
                  <span className="font-bold">{ebayStatus?.productsSynced.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Last Sync</span>
                  <span className="font-bold">Today, {ebayStatus && formatLastSync(ebayStatus.lastSync)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Sync Status</span>
                  <span className={`${ebayStatus?.syncStatus === 'up-to-date' ? 'text-green-600' : 'text-yellow-600'} font-bold`}>
                    {ebayStatus?.syncStatus === 'up-to-date' ? 'Up to date' : 'Updates Available'}
                  </span>
                </div>
              </>
            )}
            <Button className="w-full bg-[#FF9900] hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition mt-2">
              Manage eBay Connection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
