// Stepper.jsx

const { useState, useEffect } = React;

const data = {
  courseType: [
    {
      id: 1,
      title: "Full - Time",
    },
    {
      id: 2,
      title: "Part - Time",
    },
  ],
  interestArea: [
    {
      id: 1,
      title: "Agriculture, Forestry, Fisheries",
    },
    {
      id: 2,
      title: "Arts and Humanities",
    },
    {
      id: 3,
      title: "Business and Administration and Law",
    },
  ],
  location: [
    {
      id: 1,
      title: "Kathmandu",
    },
    {
      id: 2,
      title: "Koteshwor",
    },
    {
      id: 3,
      title: "Baneshwor",
    },
  ],
  mockResults: [
    {
      id: 1,
      title:
        "Athlone Community Training Center (CTC) - Catering and Hospitality",
      courseType: "Full-Time",
      location: "Kathmandu",
      duration: "2 Weeks",
      interestArea: "Engineering, Manufacturing, and Construction",
    },
    {
      id: 2,
      title: "Dublin Institute of Technology - Computer Science",
      courseType: "Full-Time",
      location: "Lalitpur",
      duration: "4 Years",
      interestArea: "Information Technology",
    },
    {
      id: 3,
      title: "Galway University - Business Administration",
      courseType: "Part-Time",
      location: "Pepsicola",
      duration: "2 Years",
      interestArea: "Business and Administration",
    },
    {
      id: 4,
      title: "Cork College of Art - Fine Arts",
      courseType: "Full-Time",
      location: "Bhaktapur",
      duration: "3 Years",
      interestArea: "Arts and Humanities",
    },
    {
      id: 5,
      title: "Limerick Institute of Technology - Engineering",
      courseType: "Full-Time",
      location: "Baneshwor",
      duration: "4 Years",
      interestArea: "Engineering, Manufacturing, and Construction",
    },
  ],
};
 
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}

const SectionTitle = ({ title, paragraph }) => {
  return (
    <div className="section-title">
      <h2 className="title">{title}</h2>
      <p className="paragraph">{paragraph}</p>
    </div>
  );
};

const SelectCourseCard = ({
  title,
  onClick,
  isSelected,
  id,
  code,
  showCheckbox = true,
  selectedDeliveryTime,
  handleCheckboxChange
}) => {
  console.log(title, id, code);
  return (
    <div className="card course-type" onClick={onClick}>
      <div className="card-body course-type-body">
        <div className="">
          <i class="far fa-clock"></i>
          <p>{title}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <button className={`rounded-button ${isSelected && "selected"}`}>{`${
            isSelected ? "Selected" : "Select"
          }`}</button>
          {showCheckbox && (
            <div>
              <p>Choose your time slot</p>
              {code === "F" ? (
                <div>
                  <input type="checkbox" disabled={!isSelected} checked />
                  <label>Day-time</label>
                </div>
              ) : (
                code === "P" && (
                  <div>
                  <label>
                    <input
                      type="checkbox"
                      name="DeliveryTime"
                      value="Daytime"
                      disabled={!isSelected}
                      checked={selectedDeliveryTime === "Daytime"}
                      onChange={handleCheckboxChange}
                    />
                    Daytime
                  </label>
            
                  <label>
                    <input
                      type="checkbox"
                      name="DeliveryTime"
                      value="EveningTime"
                      disabled={!isSelected}
                      checked={selectedDeliveryTime === "EveningTime"}
                      onChange={handleCheckboxChange}
                    />
                    Evening Time
                  </label>
                </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseFormCard = (props) => {
  const { courseType } = props;
  const [isLoading , setIsLoading] = useState(true);
  const [searchResults , setSearchResults] = useState([]);
  const [formValues, setFormValues] = useState({
    keyword : "",
    courseType: props.courseType,
    location: "",
    interestArea: props.interestArea.map((area) => ({
      value: area.Id,
      label: area.Description,
    })),
  });
  const search = useDebounce(formValues.keyword , 1000)

  const handleFormChange = (field, value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const requestData = {
        "Category Ids": formValues.interestArea.map((item) => item.value),
        Keywords: formValues.keyword,
        "Location Ids": Number(formValues.location),
      };

      try {
        const response = await fetch(
          "https://service.fetchcourses.ie/service/fetchcourse.svc/json/SearchCourseListSummaryAdvanced",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

        const data = await response.json();
        setSearchResults(data.SearchCourseListSummaryAdvancedResult.courses);
      } catch (error) {
        console.error("Error:", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [formValues]);

  return (
    <div>
    <div className="course-form box-shadow">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Search course..."
          value={formValues.keyword}
          name="keyword"
          onChange={(e) => handleFormChange("keyword" , e.target.value)}
        />
        <span className="text-primary">Find Course</span>
      </div>
      <hr />
      <div>
        <label>Filters</label>
        <div className="select-wrapper">
          <select value={formValues.courseType.Id} 
              onChange={(e) => handleFormChange("courseType", e.target.value)}>
            <option
              disabled
              selected
              value=""
            >
              Course Type
            </option>
            {props.data.courseType.map((type) => (
              <option key={type.Id} value={type.Id}>
                {type.Description}
              </option>
            ))}
          </select>
          <select name="location" value={formValues.location} onChange={(e) => handleFormChange("location", e.target.value)}>
            <option value="" disabled selected>
              Location
            </option>
            {props.data.areaList.map((loc) => (
              <option key={loc.Id} value={loc.Id}>
                {loc.Description}
              </option>
            ))}
          </select>
          <Select
            className="select-interest"
            isMulti
            options={props.data.interestArea.map((area) => ({
              value: area.Id,
              label: area.Description,
            }))}
            defaultValue={props.interestArea.map((area) => ({
              value: area.Id,
              label: area.Description,
            }))}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                flex: 1,
              }),
            }}
            onChange={(selectedOptions) =>
              handleFormChange(
                "interestArea",
                selectedOptions.map((option) => option)
              )
            }
            // value={selectedOption}
            // onChange={handleChange}
          />
        </div>
      </div>
    </div>
    <div style={{ margin: "3rem 0" }}>
          {isLoading ? "loading... " : (
            <div>
              <div>
                  <h4 style={{ marginBottom: 0 }}>Showing results</h4>
                  <span>{searchResults.length} courses</span>
                </div>
                {searchResults.map((searchVaue) => (
                  <ShowingResults searchVaue={searchVaue} key={searchVaue.id} />
                ))}
            </div>
          )}
    </div>
    </div>
  );
};

const ShowingResults = (props) => {
  const { searchVaue } = props;
  const startDate = new Date(parseInt(searchVaue.DateActualStart.substr(6)));
  const closingDate = new Date(parseInt(searchVaue.DateClosing.substr(6)));
  
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000; // Number of milliseconds in a week
  const weeksDifference = Math.abs(Math.floor((closingDate - startDate) / millisecondsPerWeek));
  
  console.log(weeksDifference);
  
  return (
    <div className="showing-results">
      <div className="card-body box-shadow">
        <div>
          <h3>
            <span className="text-primary" style={{paddingRight : '3rem'}}>{searchVaue.CourseId}</span>
            {searchVaue.CourseTitle}
          </h3>
          <hr />
        </div>
        <div>
          <ul>
            <li>
            <i class="far fa-clock"></i>
              {searchVaue.DeliveryType}
            </li>
            <li>
              <i className="far fa-map-marker-alt"></i>
              {searchVaue.CourseLocation}
            </li>
            <li>
            <i class="far fa-clock"></i>
              {weeksDifference} weeks
            </li>
            <li>
              <i className="fa fa-hand-holding-heart"></i>
              {searchVaue.CategoryDescription}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Stepper1 = (props) => {
  return (
    <div className="step step-1">
      <div className="d-flex align-items-center" style={{ flexWrap: "nowrap" }}>
        <SectionTitle
          title="Select course type"
          paragraph="We offer a wide range of full and part time courses cross Longford and Westmeath. Full time courses take place during the day and part time course are more flexible, courses are offered during the day, in the evening or online. Courses will be filtered according to your chosen option."
        />
        <button
          disabled={!props.selectedCourseType}
          onClick={props.handleNext}
          className="next-rounded-button"
          // style={{ float: "right" }}
        >
          Next
        </button>
      </div>
      <div className="wrapper d-flex">
        {props.data.courseType
          .filter((item) => item.Code !== "E")
          .map((courseType) => (
            <div className="col-3">
              <SelectCourseCard
                code={courseType.Code}
                id={courseType.Id}
                title={courseType.Description}
                key={courseType.Id}
                isSelected={props.selectedCourseType === courseType}
                selectedDeliveryTime={props.selectedDeliveryTime}
                handleCheckboxChange={props.handleCheckboxChange}
                onClick={() => props.handleCourseTypeSelection(courseType)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

const Stepper2 = (props) => {
  const {
    handleNext,
    handlePrevious,
    selectedInterestArea,
    handleInterestAreaSelection,
    data,
  } = props;
  const [interestAreas, setInterestAreas] = useState([]);
  useEffect(() => {
    fetch(
      "https://service.fetchcourses.ie/service/fetchcourse.svc/json/GetCourseCategoryList"
    )
      .then((res) => res.json())
      .then((data) => setInterestAreas(data.ReferenceList));
  }, []);
  console.log(data.interestArea);
  return (
    <div className="step step-2">
      <button
        disabled={selectedInterestArea.length === 0}
        onClick={handleNext}
        style={{ float: "right" }}
        className="next-rounded-button"
      >
        Next
      </button>
      <button
        onClick={handlePrevious}
        style={{ float: "left" }}
        className="prev-rounded-button"
      >
        Previous
      </button>
      <SectionTitle
        title="Interest Area"
        paragraph="We offer a wide range of full and part time courses cross Longford and Westmeath. Full time courses take place during the day and part time course are more flexible, courses are offered during the day, in the evening or online. Courses will be filtered according to your chosen option."
      />
      <div className="d-flex">
        {data.interestArea.map((interestArea) => (
          <div className="col-3">
            <SelectCourseCard
              id={interestArea.Id}
              title={interestArea.Description}
              key={interestArea.Id}
              showCheckbox={false}
              isSelected={selectedInterestArea.includes(interestArea)}
              onClick={() => handleInterestAreaSelection(interestArea)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Stepper3 = (props) => {
  const { handlePrevious, children, searchResults, data } = props;
  console.log(props.searchResults);
  return (
    <div className="step step-3">
      <button
        onClick={handlePrevious}
        style={{ float: "left" }}
        className="prev-rounded-button"
      >
        Previous
      </button>
      <SectionTitle
        title="Choose Course"
        paragraph="We offer a wide range of full and part time courses cross Longford and Westmeath. Full time courses take place during the day and part time course are more flexible, courses are offered during the day, in the evening or online. Courses will be filtered according to your chosen option."
      />
      {children}
    </div>
  );
};

const Stepper = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCourseType, setSelectedCourseType] = useState(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);
  const [selectedInterestArea, setSelectedInterestArea] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCourseTypeSelection = (courseType) => {
    console.log(courseType);
    if(courseType.Code === "F"){
      setSelectedDeliveryTime("Daytime")
    }
    setSelectedCourseType(courseType);
    setSelectedDeliveryTime('')
    // handleNext();
  };
  const handleInterestAreaSelection = (interestArea) => {
    if (selectedInterestArea.includes(interestArea)) {
      setSelectedInterestArea(
        selectedInterestArea.filter((area) => area !== interestArea)
      );
    } else {
      setSelectedInterestArea([...selectedInterestArea, interestArea]);
    }
  };

  const handleLocationSelection = (location) => {
    setSelectedLocation(location);
  };

  const handleCheckboxChange = (event) => {
    setSelectedDeliveryTime(event.target.value);
  };
  const handleSearch = (value) => {
    console.log("dada", { value });
    setInputSearch(value);
    const filteredResults = data.mockResults.filter((result) => {
      return result.title.toLowerCase().includes(value.toLowerCase());
    });
    setSearchResults(filteredResults);
  };

  // if (!data || !data.courseType || !data.interestArea || !data.location) {
  //   return <div>Error: Data is missing or invalid.</div>;
  // }
  const isStepCompleted = (step) => {
    if (step === 1) {
      return selectedCourseType !== null;
    } else if (step === 2) {
      return selectedInterestArea.length > 0;
    } else if (step === 3) {
      return step === 2; // Assuming step 3 is always completed
    }
    return false;
  };

  const isStepEditable = (step) => {
    return currentStep > step;
  };

  console.log({selectedDeliveryTime , selectedCourseType});

  useEffect(() => {
    Promise.all([
      fetch(
        "https://service.fetchcourses.ie/service/fetchcourse.svc/json/GetDeliveryCriteriaList"
      ).then((res) => res.json()),
      fetch(
        "https://service.fetchcourses.ie/service/fetchcourse.svc/json/GetCourseCategoryList"
      ).then((res) => res.json()),
      fetch(
        "https://service.fetchcourses.ie/service/fetchcourse.svc/json/GetAreaList"
      ).then((res) => res.json()),
    ])
      .then(([deliveryCriteria, courseCategory, areaLists]) => {
        setData({
          courseType: deliveryCriteria.ReferenceList,
          interestArea: courseCategory.ReferenceList,
          areaList: areaLists.ReferenceList,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return "loading.....";

  return (
    <div className="stepper">
      {/* header of stepper */}
      <div className="header-stepper">
        <div onClick={() => setCurrentStep(1)}>
          <div className={`step-number ${currentStep === 1 ? "active" : ""}`}>
            {isStepCompleted(1) ? <i className="fas fa-check"></i> : "1"}
          </div>
          {isStepEditable(1) ? "edit" : ""}
        </div>
        <div className="step-divider dashed"></div>
        <div onClick={() => setCurrentStep(2)}>
          <div className={`step-number ${currentStep === 2 ? "active" : ""}`}>
            {isStepCompleted(2) ? <i className="fas fa-check"></i> : "2"}
          </div>
          {isStepEditable(2) ? "edit" : ""}
        </div>
        <div className="step-divider dashed"></div>
        <div
          className={`step-number ${currentStep === 3 ? "active" : ""}`}
          onClick={() => setCurrentStep(3)}
        >
          {isStepCompleted(3) ? <i className="fas fa-check"></i> : "3"}
        </div>
      </div>
      {/* header of stepper ends*/}

      {/* stepper body starts */}
      <div className="stepper-body">
        {currentStep === 1 && (
          <Stepper1
            data={data}
            handleNext={handleNext}
            selectedCourseType={selectedCourseType}
            handleCourseTypeSelection={handleCourseTypeSelection}
            selectedDeliveryTime={selectedDeliveryTime}
            handleCheckboxChange={handleCheckboxChange}
          />
        )}
        {currentStep === 2 && (
          <Stepper2
            data={data}
            selectedInterestArea={selectedInterestArea}
            handleInterestAreaSelection={handleInterestAreaSelection}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )}
        {currentStep === 3 && (
          <Stepper3
            handlePrevious={handlePrevious}
            searchResults={searchResults}
            data={data}
          >
            <CourseFormCard
              data={data}
              setSearchResults={setSearchResults}
              inputSearch={inputSearch}
              handleSearch={handleSearch}
              courseType={selectedCourseType}
              handleCourseTypeSelection={handleCourseTypeSelection}
              interestArea={selectedInterestArea}
              handleInterestAreaSelection={handleInterestAreaSelection}
              selectedLocation={selectedLocation}
              handleLocationSelection={handleLocationSelection}
            />
          </Stepper3>
        )}
      </div>
      {/* stepper body starts */}
    </div>
  );
};

ReactDOM.render(<Stepper />, document.getElementById("root"));
