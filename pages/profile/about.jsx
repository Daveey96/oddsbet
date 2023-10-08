import React from "react";
import { PayTemplate } from ".";

function About() {
  let values = [
    {
      text: "Terms and Conditions",
      id: "tc",
      v: (
        <>
          Terms and Conditions of Use These terms and conditions ({"'"}Agreement
          {"'"}) govern your use of oddsbet.netlify.app ({"'"}the Site{"'"}). By
          accessing or using the Site, you agree to be bound by this Agreement.
          1. Eligibility 1.1 You must be of legal age to participate in gambling
          activities in your jurisdiction. 1.2 Employees, affiliates, and
          immediate family members of oddsbet are prohibited from using the
          Site. 2. Registration and Accounts 2.1 You are responsible for
          providing accurate and up-to-date information during the registration
          process. 2.2 You are solely responsible for maintaining the
          confidentiality of your account information. 2.3 You may only register
          and operate one account on the Site. 3. Deposits and Withdrawals 3.1
          Deposits and withdrawals are subject to the terms and conditions of
          the payment methods offered by the Site. 3.2 oddsbet reserves the
          right to impose deposit and withdrawal limits. 3.3 Any charges or fees
          associated with transactions are your responsibility. 4. Betting Rules
          4.1 [Company Name] reserves the right to refuse, limit, or cancel any
          bet at its sole discretion. 4.2 All bets are subject to the rules and
          regulations of the relevant gaming authority. 4.3 In the event of any
          discrepancy, the records kept by oddsbet will be considered final. 5.
          Responsible Gaming 5.1 oddsbet encourages responsible gaming and
          provides resources for those who may have a gambling problem. 5.2 You
          have the option to set limits on your deposits, bets, and losses. 6.
          Prohibited Activities 6.1 Fraudulent or illegal activities, including
          money laundering, are strictly prohibited. 6.2 The use of any
          automated systems or software to interact with the Site is prohibited.
          7. Intellectual Property 7.1 All content on the Site, including but
          not limited to logos, trademarks, and software, are the property of
          oddsbet and protected by intellectual property laws. 8. Termination
          8.1 oddsbet reserves the right to suspend or terminate your account at
          any time, with or without cause. 8.2 Upon termination, you are
          responsible for withdrawing any remaining funds in your account within
          a reasonable time frame. 9. Disclaimer of Warranty 9.1 The Site is
          provided {"'"}as is{"'"} and oddsbet makes no warranties, expressed or
          implied, regarding the accuracy, reliability, or suitability for a
          particular purpose. 10. Limitation of Liability 10.1 oddsbet shall not
          be liable for any direct, indirect, incidental, special, or
          consequential damages arising out of or in any way connected with your
          use of the Site. 11. Governing Law 11.1 This Agreement shall be
          governed by and construed in accordance with the laws of Jurisdiction.
          12. Amendments 12.1 oddsbet reserves the right to modify this
          Agreement at any time. You will be notified of any changes.
        </>
      ),
    },
    { text: "Help", id: "help" },
    { text: "FAQ", id: "faq" },
  ];
  return (
    <PayTemplate v={"Terms and Conditions"}>
      <div className="flex-1 overflow-y-scroll overflow-x-hidden">
        {values.map((v, key) => (
          <div key={key} className="mx-3">
            <h3 id={v.id} className="text-c2 pl-3 block text-xl py-6 font-bold">
              <span className="text-c1">#</span> {v.text}
            </h3>
            <div id={`${v.id}d`}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Similique cupiditate nobis cum magni minus laudantium! Laborum
              blanditiis, dolor nostrum dolore culpa commodi, alias, recusandae
              consequatur illum eius amet sapiente nesciunt? Lorem ipsum, dolor
              sit amet consectetur adipisicing elit. Similique cupiditate nobis
              cum magni minus laudantium! Laborum blanditiis, dolor nostrum
              dolore culpa commodi, alias, recusandae consequatur illum eius
              amet sapiente nesciunt? Lorem ipsum, dolor sit amet consectetur
              adipisicing elit. Similique cupiditate nobis cum magni minus
              laudantium! Laborum blanditiis, dolor nostrum dolore culpa
              commodi, alias, recusandae consequatur illum eius amet sapiente
              nesciunt?
            </div>
          </div>
        ))}
      </div>
    </PayTemplate>
  );
}

export default About;
