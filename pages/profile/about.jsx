import React from "react";
import { PayTemplate } from ".";

function About() {
  let values = [
    { text: "Terms and Conditions", id: "tc" },
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
