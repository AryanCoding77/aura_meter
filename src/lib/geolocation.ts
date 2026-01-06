// Geolocation utility to detect user's country and provide pricing

export interface PricingConfig {
  currency: string;
  symbol: string;
  prices: {
    basic: number;
    best: number;
    vip: number;
  };
  isIndia: boolean;
}

// Cache the location result to avoid multiple API calls
let cachedLocation: PricingConfig | null = null;

/**
 * Get user's pricing configuration based on their location
 * 
 * IMPORTANT: Razorpay primarily supports INR. For USD/international payments:
 * - You need to enable international payments in Razorpay dashboard
 * - Additional KYC and business verification required
 * - Consider using Stripe for international payments as an alternative
 * 
 * @returns PricingConfig with currency, symbol, and prices
 */
export async function getUserPricing(): Promise<PricingConfig> {
  // Return cached result if available
  if (cachedLocation) {
    return cachedLocation;
  }

  try {
    // Use ipapi.co for geolocation (free tier: 1000 requests/day)
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('Geolocation API failed');
    }

    const data = await response.json();
    const countryCode = data.country_code;
    
    const isIndia = countryCode === 'IN';
    
    const config: PricingConfig = isIndia
      ? {
          currency: 'INR',
          symbol: '₹',
          prices: {
            basic: 50,
            best: 100,
            vip: 150,
          },
          isIndia: true,
        }
      : {
          currency: 'USD',
          symbol: '$',
          prices: {
            basic: 2,
            best: 4,
            vip: 6,
          },
          isIndia: false,
        };

    // Cache the result
    cachedLocation = config;
    
    return config;
  } catch (error) {
    console.error('Geolocation error:', error);
    
    // Default to India pricing on error
    const defaultConfig: PricingConfig = {
      currency: 'INR',
      symbol: '₹',
      prices: {
        basic: 50,
        best: 100,
        vip: 150,
      },
      isIndia: true,
    };
    
    cachedLocation = defaultConfig;
    return defaultConfig;
  }
}

// Helper to convert INR to USD (approximate)
export function convertPrice(inrPrice: number, toUSD: boolean): number {
  if (toUSD) {
    // Approximate conversion: 1 USD = 83 INR
    return Math.round((inrPrice / 83) * 100) / 100;
  }
  return inrPrice;
}

// Clear cache (useful for testing)
export function clearLocationCache() {
  cachedLocation = null;
}
