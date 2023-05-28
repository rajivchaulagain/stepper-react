// Stepper.jsx

const { useState } = React;

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

const SectionTitle = ({ title, paragraph }) => {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <p>{paragraph}</p>
    </div>
  );
};

const SelectCourseCard = ({
  title,
  onClick,
  isSelected,
  id,
  showCheckbox = true,
}) => {
  console.log(title, id);
  return (
    <div className="card course-type" onClick={onClick}>
      <div className="card-body course-type-body">
        <div className="">
        <i class="far fa-clock"></i>       
          <p>
            {title}
            </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <button className={`rounded-button ${isSelected && "selected"}`}>{`${
            isSelected ? "Selected" : "Select"
          }`}</button>
          {showCheckbox && (
            <div>
              <p>Choose your time slot</p>
              {id === 1 ? (
                <div>
                  <input type="checkbox" disabled={!isSelected} checked />
                  <label>Day-time</label>
                </div>
              ) : (
                <div>
                  <input type="checkbox" disabled={!isSelected} />
                  <label style={{marginRight : '1rem'}}>Day-time</label>
                  <input type="checkbox" disabled={!isSelected} />
                  <label>Evening-time</label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseFormCard = (props) => {

  return (
    <div className="course-form box-shadow">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Search course..."
          value={props.inputSearch}
          onChange={(e) => props.handleSearch(e.target.value)}
        />
        <span className="text-primary">Find Course</span>
      </div>
      <hr />
      <div>
        <label>Filters</label>
        <div className="select-wrapper">
          <select value={props.courseType.title}>
            <option
              disabled
              selected
              value=""
              onChange={() =>
                props.handleCourseTypeSelection(props.courseType.title)
              }
            >
              Course Type
            </option>
            {data.courseType.map((type) => (
              <option key={type.id} value={type.title}>
                {type.title}
              </option>
            ))}
          </select>
          <select>
            <option disabled selected value="">
              Location
            </option>
            {data.location.map((loc) => (
              <option key={loc.id} value={loc.title}>
                {loc.title}
              </option>
            ))}
          </select>
          <Select
          className="select-interest"
            isMulti
            options={data.interestArea.map((area) => ({
              value: area.id,
              label: area.title,
            }))}
            defaultValue={props.interestArea.map((area) => ({
              value: area.id,
              label: area.title,
            }))}           
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                flex: 1,
              }),
            }}
            // value={selectedOption}
            // onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

const ShowingResults = (props) => {
  const { searchVaue } = props;
  return (
    <div className="showing-results">
      <div className="card-body box-shadow">
        <div>
          <h3>
            <span className="text-primary">TU869</span>
            {searchVaue.title}
          </h3>
          <hr />
        </div>
        <div>
          <ul>
            <li>
              <i className="fa fa-clock-o"></i>
              {searchVaue.courseType}
            </li>
            <li>
              <i className="fa fa-map-marker"></i>
              {searchVaue.location}
            </li>
            <li>
              <i className="fa fa-clock"></i>
              {searchVaue.duration}
            </li>
            <li>
              <i className="fa fa-hand"></i>
              {searchVaue.interestArea}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCourseType, setSelectedCourseType] = useState(null);
  const [selectedInterestArea, setSelectedInterestArea] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [searchResults, setSearchResults] = useState(data.mockResults);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCourseTypeSelection = (courseType) => {
    setSelectedCourseType(courseType);
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

  const handleSearch = (value) => {
    console.log("dada", { value });
    setInputSearch(value);
    const filteredResults = data.mockResults.filter((result) => {
      return result.title.toLowerCase().includes(value.toLowerCase());
    });
    setSearchResults(filteredResults);
  };

  if (!data || !data.courseType || !data.interestArea || !data.location) {
    return <div>Error: Data is missing or invalid.</div>;
  }

  console.log(selectedCourseType, selectedInterestArea, selectedLocation);

  return (
    <div className="stepper">
      {/* header of stepper */}
      <div className="header-stepper"></div>
      <div className="stepper-body">
        {currentStep === 1 && (
          <div className="step">
            <div className="d-flex align-items-center" style={{flexWrap : 'nowrap'}}>
            <SectionTitle
              title="Select course type"
              paragraph="We offer a wide range of full and part time courses cross Longford and Westmeath. Full time courses take place during the day and part time course are more flexible, courses are offered during the day, in the evening or online. Courses will be filtered according to your chosen option."
            />
               <button
              disabled={!selectedCourseType}
              onClick={handleNext}
              className="next-rounded-button"
              // style={{ float: "right" }}
            >
              Next
            </button>
            </div>
            <div className="wrapper d-flex">
              {data.courseType.map((courseType) => (
                <SelectCourseCard
                  id={courseType.id}
                  title={courseType.title}
                  key={courseType.id}
                  isSelected={selectedCourseType === courseType}
                  onClick={() => handleCourseTypeSelection(courseType)}
                />
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step">
            <button
              disabled={selectedInterestArea.length === 0}
              onClick={handleNext}
              style={{ float: "right" }}
              className="next-rounded-button"
            >
              Next
            </button>
            <button onClick={handlePrevious} style={{ float: "left" }} className="prev-rounded-button">
              Previous
            </button>
            <SectionTitle
              title="Interest Area"
              paragraph="We offer a wide range of full and part time courses cross Longford and Westmeath. Full time courses take place during the day and part time course are more flexible, courses are offered during the day, in the evening or online. Courses will be filtered according to your chosen option."
            />
            <div className="d-flex">
              {data.interestArea.map((interestArea) => (
                <SelectCourseCard
                  id={interestArea.id}
                  title={interestArea.title}
                  key={interestArea.id}
                  showCheckbox={false}
                  isSelected={selectedInterestArea.includes(interestArea)}
                  onClick={() => handleInterestAreaSelection(interestArea)}
                />
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step step-3">
            <button onClick={handlePrevious} style={{ float: "left" }} className="prev-rounded-button">
              Previous
            </button>
            <SectionTitle
              title="Choose Course"
              paragraph="We offer a wide range of full and part time courses cross Longford and Westmeath. Full time courses take place during the day and part time course are more flexible, courses are offered during the day, in the evening or online. Courses will be filtered according to your chosen option."
            />
            <CourseFormCard
              inputSearch={inputSearch}
              handleSearch={handleSearch}
              courseType={selectedCourseType}
              handleCourseTypeSelection={handleCourseTypeSelection}
              interestArea={selectedInterestArea}
              handleInterestAreaSelection={handleInterestAreaSelection}
              selectedLocation={selectedLocation}
              handleLocationSelection={handleLocationSelection}
            />
            <div style={{ margin: "1rem 0" }}>
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

ReactDOM.render(<Stepper />, document.getElementById("root"));
