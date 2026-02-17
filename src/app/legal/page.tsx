import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div className="bg-light pt-24 min-h-screen">
  <Navbar solid />

  <div className="mx-auto w-full max-w-4xl px-4 pb-20">
    <div className="space-y-10">

      {/* SECTION CARD */}
      <section className="rounded-2xl bg-white p-8 shadow-sm border border-dark/10">
        <h2 className="text-2xl font-bold text-dark mb-6">
          1. Terms & Conditions
        </h2>

        <div className="space-y-5 text-dark/80 leading-relaxed">
          <div>
            <h3 className="font-semibold text-dark">1.1 Nature of Platform</h3>
            <p>
              BoxesNBottles operates solely as a digital business networking
              platform connecting buyers and sellers of packaging-related
              products. The platform acts only as an intermediary and does not
              participate in any commercial transaction.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-dark">
              1.2 No Transaction Guarantee
            </h3>
            <p>
              BoxesNBottles does not guarantee financial transactions, product
              quality, delivery timelines, payment completion, or contract
              performance between users.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-dark">
              1.3 Verified Tag Disclaimer
            </h3>
            <p>
              The “Verified” tag is based solely on information provided during
              registration. It is not a government certification, legal
              endorsement, or financial guarantee.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-dark">
              1.4 User Responsibility
            </h3>
            <p>
              Users are responsible for conducting independent due diligence
              before entering into any transaction.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-dark">
              1.5 Limitation of Liability
            </h3>
            <p>
              BoxesNBottles shall not be liable for fraud, financial loss,
              delivery failure, contractual disputes, or damages arising from
              interactions between users.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-dark">1.6 Termination</h3>
            <p>
              We reserve the right to suspend or terminate accounts for misuse,
              fraud, or violation of platform policies.
            </p>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="rounded-2xl bg-white p-8 shadow-sm border border-dark/10">
        <h2 className="text-2xl font-bold text-dark mb-6">
          2. Privacy Policy
        </h2>

        <div className="space-y-5 text-dark/80 leading-relaxed">
          <div>
            <h3 className="font-semibold text-dark">
              2.1 Information We Collect
            </h3>
            <p>
              We collect business name, contact details, email, phone number,
              address, and requirement details when users register or post
              requirements.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-dark">
              2.2 Purpose of Data Collection
            </h3>
            <p>
              The collected information is used strictly for enabling business
              connections between buyers and sellers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-dark">2.3 Buyer Consent</h3>
            <p>
              By posting a requirement, buyers explicitly consent to sharing
              their details with relevant sellers for business communication
              purposes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-dark">2.4 Data Sharing</h3>
            <p>
              Buyer data may be shared with sellers because the buyer has
              voluntarily created a requirement post seeking suppliers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-dark">2.5 Data Protection</h3>
            <p>
              We implement reasonable security practices to protect user data
              but cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-dark">2.6 No Sale of Data</h3>
            <p>BoxesNBottles does not sell user data to third parties.</p>
          </div>
        </div>
      </section>

      {/* SELLER */}
      <section className="rounded-2xl bg-white p-8 shadow-sm border border-dark/10">
        <h2 className="text-2xl font-bold text-dark mb-6">
          3. Seller Agreement
        </h2>

        <div className="space-y-5 text-dark/80 leading-relaxed">
          <p><span className="font-semibold text-dark">3.1</span> Sellers receive buyer data only for legitimate business communication.</p>
          <p><span className="font-semibold text-dark">3.2</span> Sellers must not misuse, resell, or exploit buyer data.</p>
          <p><span className="font-semibold text-dark">3.3</span> All transactions are conducted independently.</p>
          <p><span className="font-semibold text-dark">3.4</span> BoxesNBottles bears no liability for disputes.</p>
          <p><span className="font-semibold text-dark">3.5</span> Sellers must comply with applicable laws.</p>
        </div>
      </section>

      {/* BUYER */}
      <section className="rounded-2xl bg-white p-8 shadow-sm border border-dark/10">
        <h2 className="text-2xl font-bold text-dark mb-6">
          4. Buyer Agreement
        </h2>

        <div className="space-y-5 text-dark/80 leading-relaxed">
          <p><span className="font-semibold text-dark">4.1</span> Buyers consent to sharing information with sellers.</p>
          <p><span className="font-semibold text-dark">4.2</span> Posting requirements implies intent to be contacted.</p>
          <p><span className="font-semibold text-dark">4.3</span> Buyers must verify sellers independently.</p>
          <p><span className="font-semibold text-dark">4.4</span> No guarantee of seller performance.</p>
          <p><span className="font-semibold text-dark">4.5</span> Buyers accept all commercial risk.</p>
        </div>
      </section>

    </div>
  </div>

  <Footer />
</div>

  );
};

export default Page;
