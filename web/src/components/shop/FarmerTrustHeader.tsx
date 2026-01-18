import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, MapPin, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';

// Define a type for the Farmer since it's nested in Product
// This matches the structure in types/index.ts for Product['farmer']
// plus adding relationshipLevel which might come from the full object if we had it,
// but looking at types/index.ts, `Product` -> `farmer` only has {id, name, location, isActive}.
// We might need to extend the type definition or rely on what's available.
// Let's assume for now we use what's on the product or minimal details,
// and if we need more (like description/relationship), we'll need to fetch it or ensure it's passed.
// Update: The plan says "Refactor product grouping logic to maintain full Farmer objects."
// So I will assume the parent component will pass a richer Farmer object.
interface FarmerProps {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  relationshipLevel?: 'SELF' | 'FAMILY' | 'FRIEND' | 'REFERRED';
}

interface FarmerTrustHeaderProps {
  farmer: FarmerProps;
  productCount: number;
}

export function FarmerTrustHeader({ farmer, productCount }: FarmerTrustHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to determine badge color based on relationship
  const getRelationshipBadge = (level?: string) => {
    switch (level) {
      case 'SELF':
      case 'FAMILY':
        return { label: 'Family Farm', className: 'bg-green-100 text-green-700 border-green-200' };
      case 'FRIEND':
        return { label: 'Trusted Friend', className: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'REFERRED':
        return {
          label: 'Community Verified',
          className: 'bg-amber-100 text-amber-700 border-amber-200',
        };
      default:
        return { label: 'Partner Farmer', className: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const badge = getRelationshipBadge(farmer.relationshipLevel);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-mandi-muted/20 overflow-hidden mb-6">
      <div className="p-6 bg-gradient-to-r from-mandi-cream/50 to-transparent">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-mandi-earth/10 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
              <User className="w-8 h-8 text-mandi-earth" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-xl font-bold text-mandi-dark">{farmer.name}</h3>
                <Badge variant="outline" className={`${badge.className} border font-medium`}>
                  {badge.label}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-mandi-muted mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{farmer.location}</span>
                </div>
                {/* Visual separator dot */}
                <span className="w-1 h-1 rounded-full bg-mandi-muted/40" />
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-mandi-green" />
                  <span>Verified Source</span>
                </div>
              </div>

              {farmer.description && (
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                  <div className="text-sm text-mandi-dark/80 max-w-2xl">
                    {!isOpen && <p className="line-clamp-2">{farmer.description}</p>}
                    <CollapsibleContent>
                      <p className="mt-1 leading-relaxed">{farmer.description}</p>
                    </CollapsibleContent>

                    {farmer.description.length > 100 && (
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="link"
                          className="px-0 h-auto text-mandi-green font-semibold mt-1 hover:no-underline flex items-center gap-1 text-xs"
                        >
                          {isOpen ? 'Read Less' : 'Read Our Story'}
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                </Collapsible>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end justify-center">
            <div className="bg-white px-4 py-2 rounded-lg border border-mandi-muted/10 text-center shadow-sm">
              <span className="block text-2xl font-bold text-mandi-dark leading-none">
                {productCount}
              </span>
              <span className="text-[10px] uppercase text-mandi-muted font-bold tracking-wider">
                Products
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
