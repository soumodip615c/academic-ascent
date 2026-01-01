import { useState } from "react";
import { CreditCard, Phone, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFees } from "@/hooks/useFees";
import { format } from "date-fns";
import { toast } from "sonner";

const Fees = () => {
  const [transactionId, setTransactionId] = useState("");
  const { data: fees = [], isLoading } = useFees();

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Payment proof submitted! Your teacher will verify it soon.");
    setTransactionId("");
  };

  // Calculate totals from fees data
  const totalAmount = fees.reduce((acc, f) => acc + Number(f.amount), 0);
  const paidAmount = fees
    .filter((f) => f.status === "paid" || f.status === "verified")
    .reduce((acc, f) => acc + Number(f.amount), 0);
  const dueAmount = totalAmount - paidAmount;

  const latestFee = fees[0];

  return (
    <StudentLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="feature-icon-purple">
              <CreditCard className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
              Fees
            </h1>
          </div>
          <p className="text-muted-foreground">
            Fee status and payment details for your course.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card-education animate-pulse">
                <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-muted rounded mb-2"></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fee Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Card */}
              <div className="card-education">
                <h2 className="font-semibold text-foreground mb-4 font-heading">
                  Fee Summary
                </h2>
                
                <div className="space-y-3">
                  {latestFee && (
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Course</span>
                      <span className="font-medium text-foreground">{latestFee.course}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-medium text-foreground">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Paid Amount</span>
                    <span className="font-medium text-education-green">₹{paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Due Amount</span>
                    <span className="font-medium text-education-orange">₹{dueAmount.toLocaleString()}</span>
                  </div>
                  {latestFee && (
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Due Date</span>
                      <span className="font-medium text-foreground">
                        {format(new Date(latestFee.due_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Status</span>
                    {dueAmount > 0 ? (
                      <span className="status-pending">Pending</span>
                    ) : (
                      <span className="status-paid">Paid</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="card-education">
                <h2 className="font-semibold text-foreground mb-4 font-heading">
                  Payment History
                </h2>
                
                {fees.filter(f => f.status === "paid" || f.status === "verified").length > 0 ? (
                  <div className="space-y-3">
                    {fees
                      .filter((f) => f.status === "paid" || f.status === "verified")
                      .map((payment) => (
                        <div 
                          key={payment.id}
                          className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-foreground">₹{Number(payment.amount).toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.payment_date
                                ? format(new Date(payment.payment_date), "MMM d, yyyy")
                                : format(new Date(payment.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-education-green">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Verified</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No payments made yet.</p>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-6">
              {/* UPI Payment Info */}
              <div className="card-education bg-education-teal-light border-2 border-education-teal/20">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="w-5 h-5 text-education-teal" />
                  <h2 className="font-semibold text-foreground font-heading">
                    Pay Fees via UPI
                  </h2>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    PhonePe / GPay / Paytm
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    91233 52552
                  </p>
                  <p className="text-muted-foreground">
                    SUCCESS CODING WORLD
                  </p>
                </div>
              </div>

              {/* Submit Payment Proof */}
              <div className="card-education">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-5 h-5 text-education-blue" />
                  <h2 className="font-semibold text-foreground font-heading">
                    Submit Payment Proof
                  </h2>
                </div>
                
                <form onSubmit={handleSubmitProof} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID / UTR</Label>
                    <Input
                      id="transactionId"
                      placeholder="Enter transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="screenshot">Payment Screenshot</Label>
                    <Input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Submit Proof
                  </Button>
                </form>
                
                <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>Your teacher will verify the payment within 24-48 hours.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && fees.length === 0 && (
          <div className="text-center py-16">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No fee records found.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Fees;
