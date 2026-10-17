import { supabase } from '../utils/supabaseClient';

const getTabSessionId = () => {
  if (typeof window === 'undefined') return 'server_session';
  let id = sessionStorage.getItem('baza_shop_presence_tab_id');
  if (!id) {
    id = `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('baza_shop_presence_tab_id', id);
  }
  return id;
};

class PresenceService {
  constructor() {
    this.channel = null;
    this.listeners = new Set();
    this.sessionId = getTabSessionId();
    this.role = 'visitor';
    this.isTracking = false;
    this.stats = {
      total: 1,
      visitors: 0,
      admins: 1,
    };
  }

  /**
   * Initialize or update presence role ('visitor' | 'admin')
   */
  init(role = 'visitor') {
    this.role = role;

    // If channel is already subscribed, just update track
    if (this.channel && this.isTracking) {
      this.channel.track({
        role: this.role,
        tabId: this.sessionId,
        onlineAt: new Date().toISOString(),
      }).catch(() => {});
      return;
    }

    try {
      this.channel = supabase.channel('baza_shop_live_presence', {
        config: {
          presence: {
            key: this.sessionId,
          },
        },
      });

      const handlePresenceSync = () => {
        if (!this.channel) return;
        const state = this.channel.presenceState();
        const keys = Object.keys(state);
        const total = Math.max(1, keys.length);

        let visitors = 0;
        let admins = 0;

        keys.forEach((key) => {
          const presences = state[key] || [];
          const isAdmin = presences.some((p) => p.role === 'admin');
          if (isAdmin) {
            admins += 1;
          } else {
            visitors += 1;
          }
        });

        this.stats = {
          total,
          visitors,
          admins: Math.max(1, admins),
        };

        this.notify();
      };

      this.channel
        .on('presence', { event: 'sync' }, handlePresenceSync)
        .on('presence', { event: 'join' }, handlePresenceSync)
        .on('presence', { event: 'leave' }, handlePresenceSync)
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            this.isTracking = true;
            try {
              await this.channel.track({
                role: this.role,
                tabId: this.sessionId,
                onlineAt: new Date().toISOString(),
              });
            } catch (err) {
              console.warn('Presence track warning:', err);
            }
          }
        });
    } catch (err) {
      console.warn('Realtime presence channel init notice:', err);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.leave();
      });
    }
  }

  notify() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.stats);
      } catch (err) {
        console.error('Presence callback error:', err);
      }
    });
  }

  /**
   * Subscribe to online visitor stats
   * @param {Function} callback receives { total, visitors, admins }
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.stats);
    return () => {
      this.listeners.delete(callback);
    };
  }

  async leave() {
    if (this.channel && this.isTracking) {
      try {
        await this.channel.untrack();
        supabase.removeChannel(this.channel);
        this.channel = null;
        this.isTracking = false;
      } catch (err) {
        // Silent cleanup on unload
      }
    }
  }
}

export const presenceService = new PresenceService();
