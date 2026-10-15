import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  FileText, 
  Building2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { Offer, UserProfile } from '../../types';
import { DataStore } from '../../lib/storage';

interface StudentOffersProps {
  currentUser: UserProfile;
  onRefreshUser: (updated: UserProfile) => void;
}

export const StudentOffers: React.FC<StudentOffersProps> = ({ 
  currentUser,
  onRefreshUser 
}) => {
  const [offers, setOffers] = useState<Offer[]>(
    DataStore.getOffers().filter(o => o.student_id === currentUser.id)
  );

  const handleResponse = (offerId: string, status: 'accepted' | 'declined') => {
    DataStore.respondToOffer(offerId, status);
    setOffers(DataStore.getOffers().filter(o => o.student_id === currentUser.id));
    onRefreshUser(DataStore.getCurrentUser());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-400" />
          <span>Official Placement Job Offers</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review formal offers, compensation breakdown, and joining timelines issued by verified recruiters.
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
          <Award className="w-12 h-12 mx-auto opacity-30 text-purple-400" />
          <h3 className="font-bold text-white text-base">No Job Offers Extended Yet</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            Keep applying for campus vacancies and practicing technical mock interviews. Offers issued after interview rounds will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {offers.map(offer => {
            const isAccepted = offer.status === 'accepted';
            const isDeclined = offer.status === 'declined';
            const isPending = offer.status === 'pending';

            return (
              <div
                key={offer.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl relative overflow-hidden"
              >
                {isAccepted && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                    Offer Accepted
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                      Formal Campus Offer
                    </span>
                    <h2 className="text-xl font-bold text-white mt-0.5">{offer.role_title}</h2>
                    <p className="text-sm font-semibold text-slate-300">{offer.company_name}</p>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs text-slate-400 block">Total Compensation</span>
                    <span className="text-2xl font-extrabold text-emerald-400">{offer.ctc_or_stipend}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Projected Joining Date</span>
                    <span className="font-semibold text-white">{offer.joining_date || 'July 2026'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Employment Bond / Service Agreement</span>
                    <span className="font-semibold text-white">{offer.bond_details || 'No bond required.'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400">
                    Issued: {new Date(offer.issued_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResponse(offer.id, 'declined')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 font-semibold transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleResponse(offer.id, 'accepted')}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition shadow-lg shadow-emerald-600/25 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Official Offer</span>
                      </button>
                    </div>
                  )}

                  {isAccepted && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Offer Formally Accepted & Placement Recorded</span>
                    </span>
                  )}

                  {isDeclined && (
                    <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>Offer Declined</span>
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
