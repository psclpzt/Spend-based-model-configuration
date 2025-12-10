import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Types
interface CategoryMultiplier {
  id: number;
  category: string;
  pointsPerDollar: number;
}

interface RedemptionValueAdjustment {
  id: number;
  category: string;
  pointValue: number; // 1 point = $X
}

const MOCK_PRODUCTS = [
  "1-hour jump pass",
  "All day jump pass",
  "30-min climb pass add-on",
  "Laser Tag – 1 game",
  "Burger",
  "Jump socks",
  "Gift Card",
];

export default function App(): JSX.Element {
  // Program details
  const [programName, setProgramName] = useState("Sky Zone Loyalty");
  const [programDescription, setProgramDescription] = useState("Entered text");

  // Program rules
  const [pointsPerDollar, setPointsPerDollar] = useState(1);
  const [signUpBonus, setSignUpBonus] = useState(false);

  // Advanced earning settings
  const [showAdvancedEarning, setShowAdvancedEarning] = useState(false);
  const [eligibleProductsScope, setEligibleProductsScope] = useState<"all" | "selected">("all");
  const [categoryMultipliers, setCategoryMultipliers] = useState<CategoryMultiplier[]>([]);
  const [nextMultiplierId, setNextMultiplierId] = useState(1);

  // Redemption rules
  const [pointValue, setPointValue] = useState(0.01); // 1 point = $0.01 (shown as $1 in UI for 100 points = $1.00)
  const [redemptionIncrement, setRedemptionIncrement] = useState(10);
  const [minimumPointsToRedeem, setMinimumPointsToRedeem] = useState(100);
  const [minimumSpendRequired, setMinimumSpendRequired] = useState(false);

  // Advanced redemption settings
  const [showAdvancedRedemption, setShowAdvancedRedemption] = useState(false);
  const [excludedProducts, setExcludedProducts] = useState<string[]>([]);
  const [redemptionValueAdjustments, setRedemptionValueAdjustments] = useState<RedemptionValueAdjustment[]>([]);
  const [nextAdjustmentId, setNextAdjustmentId] = useState(1);
  const [excludedProductsPickerOpen, setExcludedProductsPickerOpen] = useState(false);

  // Expiry rules
  const [pointExpiryEnabled, setPointExpiryEnabled] = useState(false);
  const [expiryReminderEnabled, setExpiryReminderEnabled] = useState(false);

  const addCategoryMultiplier = (): void => {
    setCategoryMultipliers([
      ...categoryMultipliers,
      { id: nextMultiplierId, category: "Entered text", pointsPerDollar: 1 },
    ]);
    setNextMultiplierId(nextMultiplierId + 1);
  };

  const removeCategoryMultiplier = (id: number): void => {
    setCategoryMultipliers(categoryMultipliers.filter((m) => m.id !== id));
  };

  const updateCategoryMultiplier = (id: number, field: keyof CategoryMultiplier, value: string | number): void => {
    setCategoryMultipliers(
      categoryMultipliers.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const addRedemptionValueAdjustment = (): void => {
    setRedemptionValueAdjustments([
      ...redemptionValueAdjustments,
      { id: nextAdjustmentId, category: "Entered text", pointValue: 100 },
    ]);
    setNextAdjustmentId(nextAdjustmentId + 1);
  };

  const removeRedemptionValueAdjustment = (id: number): void => {
    setRedemptionValueAdjustments(redemptionValueAdjustments.filter((a) => a.id !== id));
  };

  const updateRedemptionValueAdjustment = (
    id: number,
    field: keyof RedemptionValueAdjustment,
    value: string | number
  ): void => {
    setRedemptionValueAdjustments(
      redemptionValueAdjustments.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  // pointValue is already in decimal (0.01 = $0.01 per point)
  // Display: 100 points = $1.00 means 1 point = $0.01

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#003e7f] text-[#f9fafb] flex flex-col p-4">
        <div className="flex items-center gap-2 px-2.5 py-2 pb-4 font-semibold text-sm">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[#ff6b35] to-[#ff2e63]"></div>
          <div>RollerWorld</div>
          <div className="ml-auto">▼</div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-2 py-1.5 rounded text-[13px] bg-[#002c5a] border border-[#004a99] text-white placeholder-gray-400 outline-none"
          />
        </div>
        <div>
          {[
            { name: "Dashboard", icon: "📊" },
            { name: "Activity center", badge: 3 },
            { name: "Bookings", icon: "📅" },
            { name: "Products", icon: "📦" },
            { name: "Guests", icon: "👥" },
            { name: "Loyalty", icon: "🎁", active: true, children: ["Loyalty members", "Settings"] },
            { name: "Documents", icon: "📄" },
            { name: "Reports", icon: "📈" },
            { name: "Apps", icon: "🔌" },
            { name: "Settings", icon: "⚙️" },
            { name: "What's new", badge: 3 },
          ].map((item) => (
            <div key={item.name}>
              <div
                className={`text-[13px] px-2.5 py-1.5 rounded flex items-center justify-between ${
                  item.active ? "bg-[#002c5a] font-medium" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.children && item.active && (
                <div className="ml-4 mt-1">
                  {item.children.map((child) => (
                    <div
                      key={child}
                      className={`text-[13px] px-2.5 py-1.5 rounded ${
                        child === "Settings" ? "bg-[#001f3f] font-medium" : ""
                      }`}
                    >
                      {child}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">
        <header className="mb-4">
          <div className="text-xs text-gray-500 mb-1 uppercase">LOYALTY &gt; SETTINGS</div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[22px] font-semibold text-gray-900 m-0">Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Set up your spend-based loyalty program.</p>
            </div>
            <div className="flex gap-2 items-center">
              <Button variant="outline" className="rounded text-[13px] px-3.5 py-1.5 border-gray-300">
                Cancel
              </Button>
              <Button className="rounded text-[13px] px-3.5 py-1.5 bg-[#e11d48] hover:bg-[#d11a42] text-white font-medium">
                Save
              </Button>
            </div>
          </div>
        </header>

        {/* Program details */}
        <Card className="mb-6 rounded border border-gray-300 bg-white">
          <CardContent className="p-5 md:p-6">
            <h2 className="text-base font-semibold mb-3 m-0">Program details</h2>
            <div className="flex flex-col mb-3 max-w-[540px]">
              <Label htmlFor="program-name" className="text-[13px] mb-1">
                Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="program-name"
                className="rounded border-gray-300 text-[13px] px-2 py-1.5 h-auto"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-3 max-w-[540px]">
              <Label htmlFor="program-description" className="text-[13px] mb-1">
                Description
              </Label>
              <textarea
                id="program-description"
                className="rounded border border-gray-300 text-[13px] px-2 py-1.5 min-h-[64px] resize-y outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/25"
                value={programDescription}
                onChange={(e) => setProgramDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Earning rules */}
        <Card className="mb-6 rounded border border-gray-300 bg-white">
          <CardContent className="p-5 md:p-6">
            <h2 className="text-base font-semibold mb-3 m-0">Earning rules</h2>

            <div className="mb-4">
              <Label className="text-[13px] mb-2 block">How guests earn points</Label>
              <div className="flex items-center gap-2 flex-wrap text-[13px]">
                <span>For every $1 spent, guest earn</span>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  className="rounded border-gray-300 text-[13px] px-2 py-1.5 h-auto w-12"
                  value={pointsPerDollar}
                  onChange={(e) => setPointsPerDollar(parseFloat(e.target.value) || 0)}
                />
                <span>point(s).</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-start gap-2 text-[13px] text-gray-900">
                <input
                  type="checkbox"
                  checked={signUpBonus}
                  onChange={(e) => setSignUpBonus(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium">Sign up bonus</span>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Give guests bonus points when they sign up for your loyalty program.
                  </div>
                </div>
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-start gap-2 text-[13px] text-gray-900">
                <input
                  type="checkbox"
                  checked={minimumSpendRequired}
                  onChange={(e) => setMinimumSpendRequired(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium">Minimum spend</span>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Guests must meet this minimum spend before they can redeem points.
                  </div>
                </div>
              </label>
            </div>

            {/* Advanced earning settings - collapsible sub-section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowAdvancedEarning(!showAdvancedEarning)}
                className="w-full flex items-center justify-between text-sm font-semibold mb-0"
              >
                <span>Advanced earning settings</span>
                <span className="text-gray-500">{showAdvancedEarning ? "▼" : "▶"}</span>
              </button>

              {showAdvancedEarning && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label className="text-[13px] mb-2 block">
                      Eligible products
                    </Label>
                    <p className="text-xs text-gray-500 mb-3">
                      Choose which products the earning applies to.
                    </p>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="eligible-products"
                          checked={eligibleProductsScope === "all"}
                          onChange={() => setEligibleProductsScope("all")}
                        />
                        All products
                      </label>
                      <label className="flex items-center gap-2 text-[13px]">
                        <input
                          type="radio"
                          name="eligible-products"
                          checked={eligibleProductsScope === "selected"}
                          onChange={() => setEligibleProductsScope("selected")}
                        />
                        Selected products
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[13px] mb-2 block">
                      Category multipliers
                    </Label>
                    <p className="text-xs text-gray-500 mb-3">
                      Set custom earning rates for specific product categories.
                    </p>
                    {categoryMultipliers.length > 0 && (
                      <div className="mb-3 border border-gray-200 rounded">
                        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-[13px] font-medium">
                          <div>Category</div>
                          <div>Points per $1 spend</div>
                        </div>
                        {categoryMultipliers.map((multiplier) => (
                          <div
                            key={multiplier.id}
                            className="grid grid-cols-2 gap-4 p-3 border-b border-gray-200 last:border-b-0 items-center"
                          >
                            <Input
                              className="rounded border-gray-300 text-[13px] px-2 py-1.5 h-auto"
                              value={multiplier.category}
                              onChange={(e) =>
                                updateCategoryMultiplier(multiplier.id, "category", e.target.value)
                              }
                              placeholder="Entered text"
                            />
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                className="rounded border-gray-300 text-[13px] px-2 py-1.5 h-auto flex-1"
                                value={multiplier.pointsPerDollar}
                                onChange={(e) =>
                                  updateCategoryMultiplier(
                                    multiplier.id,
                                    "pointsPerDollar",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                placeholder="Entered text"
                              />
                              <button
                                type="button"
                                onClick={() => removeCategoryMultiplier(multiplier.id)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="rounded text-xs px-2.5 py-1 border-gray-300"
                      onClick={addCategoryMultiplier}
                    >
                      Add category
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Redemption rules */}
        <Card className="mb-6 rounded border border-gray-300 bg-white">
          <CardContent className="p-5 md:p-6">
            <h2 className="text-base font-semibold mb-3 m-0">Redemption rules</h2>

            <div className="mb-4">
              <Label className="text-[13px] mb-2 block">Point value</Label>
              <p className="text-xs text-gray-500 mb-2">
                Set how much one point is worth when redeemed.
              </p>
              <div className="flex items-center gap-2 flex-wrap text-[13px]">
                <span>1 point = $</span>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  className="rounded border-gray-300 text-[13px] px-2 py-1.5 h-auto w-20"
                  value={pointValue}
                  onChange={(e) => setPointValue(parseFloat(e.target.value) || 0)}
                />
                <span className="text-gray-500">(100 points = ${(100 * pointValue).toFixed(2)})</span>
              </div>
            </div>

            <div className="mb-4">
              <Label className="text-[13px] mb-2 block">Redemption increments</Label>
              <p className="text-xs text-gray-500 mb-2">
                Guests can redeem points in multiples of {redemptionIncrement} (e.g., {redemptionIncrement}, {redemptionIncrement * 2}, {redemptionIncrement * 3}...).
              </p>
              <div className="flex items-center gap-2 flex-wrap text-[13px]">
                <span>Guests can redeem points in blocks of</span>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  className="rounded border-gray-300 text-[13px] px-2 py-1.5 h-auto w-20"
                  value={redemptionIncrement}
                  onChange={(e) => setRedemptionIncrement(parseInt(e.target.value) || 0)}
                />
                <span>point(s).</span>
              </div>
            </div>

            <div className="mb-4">
              <Label className="text-[13px] mb-2 block">Minimum points to redeem</Label>
              <p className="text-xs text-gray-500 mb-2">
                Guests can only redeem points once their balance reaches this amount.
              </p>
              <div className="flex items-center gap-2 flex-wrap text-[13px]">
                <span>Guests must have at least</span>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  className="rounded border-gray-300 text-[13px] px-2 py-1.5 h-auto w-20"
                  value={minimumPointsToRedeem}
                  onChange={(e) => setMinimumPointsToRedeem(parseInt(e.target.value) || 0)}
                />
                <span>points to redeem.</span>
              </div>
            </div>

            {/* Advanced redemption settings - collapsible sub-section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowAdvancedRedemption(!showAdvancedRedemption)}
                className="w-full flex items-center justify-between text-sm font-semibold mb-0"
              >
                <span>Advanced redemption settings</span>
                <span className="text-gray-500">{showAdvancedRedemption ? "▼" : "▶"}</span>
              </button>

              {showAdvancedRedemption && (
                <div className="mt-4 space-y-4">
                <div>
                  <Label className="text-[13px] mb-2 block">Excluded products</Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Choose which products cannot be purchased using points.
                  </p>
                  <Dialog open={excludedProductsPickerOpen} onOpenChange={setExcludedProductsPickerOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded text-[13px] px-3.5 py-1.5 border-gray-300">
                        Select products
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Select excluded products</DialogTitle>
                        <DialogDescription>Choose which products cannot be purchased using points.</DialogDescription>
                      </DialogHeader>
                      <div className="grid md:grid-cols-2 gap-2 mt-2 max-h-[400px] overflow-y-auto">
                        {MOCK_PRODUCTS.map((product) => (
                          <label
                            key={product}
                            className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={excludedProducts.includes(product)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setExcludedProducts([...excludedProducts, product]);
                                } else {
                                  setExcludedProducts(excludedProducts.filter((p) => p !== product));
                                }
                              }}
                            />
                            <span>{product}</span>
                          </label>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  {excludedProducts.length > 0 && (
                    <div className="text-xs text-gray-600 mt-2">
                      {excludedProducts.length} product(s) excluded
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-[13px] mb-2 block">Redemption value adjustments</Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Adjust how much points are worth for specific product categories. Categories not listed here will use the point value you set above.
                  </p>
                  {redemptionValueAdjustments.length > 0 && (
                    <div className="mb-3 border border-gray-200 rounded">
                      <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-[13px] font-medium">
                        <div>Category</div>
                        <div>Point value (1 point = $...)</div>
                      </div>
                      {redemptionValueAdjustments.map((adjustment) => (
                        <div
                          key={adjustment.id}
                          className="grid grid-cols-2 gap-4 p-3 border-b border-gray-200 last:border-b-0 items-center"
                        >
                          <Input
                            className="rounded border-gray-300 text-[13px] px-2 py-1.5 h-auto"
                            value={adjustment.category}
                            onChange={(e) =>
                              updateRedemptionValueAdjustment(adjustment.id, "category", e.target.value)
                            }
                            placeholder="Entered text"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-[13px]">$</span>
                            <Input
                              type="number"
                              className="rounded border-gray-300 text-[13px] px-2 py-1.5 h-auto flex-1"
                              value={adjustment.pointValue}
                              onChange={(e) =>
                                updateRedemptionValueAdjustment(
                                  adjustment.id,
                                  "pointValue",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              placeholder="100.00"
                            />
                            <button
                              type="button"
                              onClick={() => removeRedemptionValueAdjustment(adjustment.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="rounded text-xs px-2.5 py-1 border-gray-300"
                    onClick={addRedemptionValueAdjustment}
                  >
                    Add category
                  </Button>
                </div>
              </div>
            )}
            </div>
          </CardContent>
        </Card>

        {/* Expiry rules */}
        <Card className="mb-6 rounded border border-gray-300 bg-white">
          <CardContent className="p-5 md:p-6">
            <h2 className="text-base font-semibold mb-3 m-0">Expiry rules</h2>

            <div className="mb-4">
              <label className="flex items-start gap-2 text-[13px] text-gray-900">
                <input
                  type="checkbox"
                  checked={pointExpiryEnabled}
                  onChange={(e) => setPointExpiryEnabled(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium">Point expiry (rolling expiry)</span>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Points expire after
                  </div>
                </div>
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-start gap-2 text-[13px] text-gray-900">
                <input
                  type="checkbox"
                  checked={expiryReminderEnabled}
                  onChange={(e) => setExpiryReminderEnabled(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium">Expiry reminder</span>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Send guests an email before their points expire.
                  </div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
