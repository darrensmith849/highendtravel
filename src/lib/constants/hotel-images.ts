// Maps hotel_contact_id to image URL for the trip timeline
// Primary: Unsplash photos of each location
// Fallback: local SVG illustrations in /public/images/hotels/
export const hotelImages: Record<string, { src: string; fallback: string }> = {
  '50000000-0000-0000-0000-000000000001': {
    src: 'https://images.unsplash.com/photo-1729092901505-247804aa3748?w=800&h=500&fit=crop&q=80',
    fallback: '/images/hotels/castello-di-velona.svg',
  },
  '50000000-0000-0000-0000-000000000002': {
    src: 'https://images.unsplash.com/photo-1723994878397-f21e4f2b3887?w=800&h=500&fit=crop&q=80',
    fallback: '/images/hotels/rosewood-cape-kidnappers.svg',
  },
  '50000000-0000-0000-0000-000000000003': {
    src: 'https://images.unsplash.com/photo-1728917245498-022f576e7fa0?w=800&h=500&fit=crop&q=80',
    fallback: '/images/hotels/singita-kruger.svg',
  },
  '50000000-0000-0000-0000-000000000004': {
    src: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=800&h=500&fit=crop&q=80',
    fallback: '/images/hotels/villa-treville.svg',
  },
  '50000000-0000-0000-0000-000000000005': {
    src: 'https://images.unsplash.com/photo-1689088033498-bfcecbafab6a?w=800&h=500&fit=crop&q=80',
    fallback: '/images/hotels/alpina-gstaad.svg',
  },
  '50000000-0000-0000-0000-000000000006': {
    src: 'https://images.unsplash.com/photo-1591460148560-fa3b22ace2b3?w=800&h=500&fit=crop&q=80',
    fallback: '/images/hotels/ngorongoro-crater-lodge.svg',
  },
  '50000000-0000-0000-0000-000000000007': {
    src: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=500&fit=crop&q=80',
    fallback: '/images/hotels/segera-retreat.svg',
  },
  '50000000-0000-0000-0000-000000000008': {
    src: 'https://images.unsplash.com/photo-1729092900652-462bfad29b72?w=800&h=500&fit=crop&q=80',
    fallback: '/images/hotels/borgo-santo-pietro.svg',
  },
};
