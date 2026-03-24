const user = {
  email: "",
  password: ""
}

const categories = [
  {
    code: "01",
    name: "Bandas de Mexico",
    description: "",
    active: true
  }
]

const concerts = [
  {
    code: "C01",
    name: "",
    category: "01",
    price: 0,
    eventDate: "",
    hour: "",
    city: "",
    imageUrl: "",
    description: ""
  },
  {
    code: "C05",
    name: "",
    category: "01",
    price: 12,
    eventDate: "",
    hour: "",
    city: "",
    imageUrl: "",
    description: ""
  }
];


const sales = [
  {
    customer: {
      identificationNumber: "",
      fullName: "",
      address: "",
      phone: "",
      email: ""
    },
    tickets: [
      {
        concert: {
          code: "C01",
          name: "",
          category: "01",
          price: 10,
          eventDate: "",
          hour: "",
          city: "",
          imageUrl: "",
          description: ""
        },
        quantity: 2
      }, // 20
      {
        concert: "C05",
        quantity: 1
      }
    ]
  }
]